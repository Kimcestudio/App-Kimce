"""Aplicación Flask mínima para interactuar con App Kimce."""
from __future__ import annotations

import argparse
import socket
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional

from flask import Flask, flash, redirect, render_template, request, session, url_for

from app_kimce.admin import AdminPortal
from app_kimce.models import Collaborator, RequestType, Role
from app_kimce.portal import CollaboratorPortal, FlowError

app = Flask(__name__)
app.secret_key = "kimce-demo-ui"


class AccessStatus(str, Enum):
    """Estados posibles para un acceso basado en correo."""

    PENDING = "pendiente"
    APPROVED = "aprobado"
    DENIED = "denegado"


@dataclass
class AccessRequest:
    """Solicitud de acceso registrada por correo."""

    email: str
    collaborator_id: str
    collaborator_name: str
    created_at: datetime
    position: Optional[str] = None
    desired_role: Role = Role.COLLABORATOR
    status: AccessStatus = AccessStatus.PENDING
    reviewer: Optional[str] = None
    updated_at: Optional[datetime] = None

    def approve(self, reviewer: str) -> None:
        self.status = AccessStatus.APPROVED
        self.reviewer = reviewer
        self.updated_at = datetime.now()

    def deny(self, reviewer: str) -> None:
        self.status = AccessStatus.DENIED
        self.reviewer = reviewer
        self.updated_at = datetime.now()


def _bootstrap_collaborators() -> List[Collaborator]:
    """Genera colaboradores demo para la interfaz."""

    return [
        Collaborator(
            "COL-001",
            "Ana Pérez",
            timedelta(hours=8),
            "ana@kimce.studio",
            position="Directora Creativa",
            role=Role.ADMIN,
        ),
        Collaborator(
            "COL-002",
            "Luis Gómez",
            timedelta(hours=6, minutes=30),
            "luis@kimce.studio",
            position="Diseñador Senior",
            role=Role.COLLABORATOR,
        ),
    ]


collaborators = _bootstrap_collaborators()
collaborator_portals: Dict[str, CollaboratorPortal] = {
    c.collaborator_id: CollaboratorPortal(c) for c in collaborators
}
collaborators_by_email: Dict[str, Collaborator] = {
    c.email.lower(): c for c in collaborators
}
access_requests: Dict[str, AccessRequest] = {}
for index, collaborator in enumerate(collaborators):
    status = AccessStatus.APPROVED if index == 0 else AccessStatus.PENDING
    reviewer = "Auto demo" if status == AccessStatus.APPROVED else None
    updated_at = datetime.now() if status == AccessStatus.APPROVED else None
    access_requests[collaborator.email.lower()] = AccessRequest(
        email=collaborator.email.lower(),
        collaborator_id=collaborator.collaborator_id,
        collaborator_name=collaborator.full_name,
        position=collaborator.position,
        desired_role=collaborator.role,
        created_at=datetime.now(),
        status=status,
        reviewer=reviewer,
        updated_at=updated_at,
    )
admin_portal = AdminPortal(collaborators)


def _current_week_start() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


def _require_session(collaborator_id: str) -> bool:
    """Valida que el colaborador en sesión sea el dueño del portal."""

    logged_id = session.get("collaborator_id")
    if logged_id != collaborator_id:
        flash("Inicia sesión con tu correo corporativo para acceder a tu portal.", "error")
        return False
    return True


@app.context_processor
def inject_session_data():
    collaborator = None
    collaborator_id = session.get("collaborator_id")
    if collaborator_id and collaborator_id in collaborator_portals:
        collaborator = collaborator_portals[collaborator_id].collaborator
    return {"active_collaborator": collaborator}


@app.route("/")
def home() -> str:
    week_start = _current_week_start()
    collaborator_cards = []
    for portal in collaborator_portals.values():
        collaborator_cards.append(
            {
                "collaborator": portal.collaborator,
                "summary": portal.week_summary(week_start),
                "indicator": portal.weekly_indicator(week_start),
            }
        )
    admin_summary = admin_portal.hours_balance_summary()
    holidays = admin_portal.list_holidays()
    return render_template(
        "home.html",
        collaborator_cards=collaborator_cards,
        admin_summary=admin_summary,
        holidays=holidays,
    )


@app.route("/login", methods=["GET", "POST"])
def login():  # type: ignore[override]
    next_id = request.values.get("next")
    if request.method == "POST":
        email = (request.form.get("email") or "").strip().lower()
        if not email:
            flash("Ingresa tu correo corporativo", "error")
            if next_id:
                return redirect(url_for("login", next=next_id))
            return redirect(url_for("login"))
        collaborator = collaborators_by_email.get(email)
        if not collaborator:
            flash("No encontramos ese correo en el equipo.", "error")
            if next_id:
                return redirect(url_for("login", next=next_id))
            return redirect(url_for("login"))
        access_request = access_requests.get(email)
        if not access_request:
            access_request = AccessRequest(
                email=email,
                collaborator_id=collaborator.collaborator_id,
                collaborator_name=collaborator.full_name,
                position=collaborator.position,
                desired_role=collaborator.role,
                created_at=datetime.now(),
            )
            access_requests[email] = access_request
            flash("Tu solicitud de acceso fue enviada al panel admin.", "info")
            if next_id:
                return redirect(url_for("login", next=next_id))
            return redirect(url_for("login"))
        if access_request.status == AccessStatus.DENIED:
            flash("Tu acceso fue denegado. Contacta a administración.", "error")
            if next_id:
                return redirect(url_for("login", next=next_id))
            return redirect(url_for("login"))
        if access_request.status == AccessStatus.PENDING:
            flash("Tu acceso aún está pendiente de aprobación.", "info")
            if next_id:
                return redirect(url_for("login", next=next_id))
            return redirect(url_for("login"))
        session["collaborator_id"] = collaborator.collaborator_id
        flash("Sesión iniciada", "success")
        destination = collaborator.collaborator_id
        if next_id and next_id == collaborator.collaborator_id:
            destination = next_id
        return redirect(url_for("collaborator_view", collaborator_id=destination))
    return render_template("login.html", next_id=next_id)


@app.get("/logout")
def logout():  # type: ignore[override]
    session.pop("collaborator_id", None)
    flash("Sesión cerrada", "info")
    return redirect(url_for("home"))


@app.route("/colaborador/<collaborator_id>")
def collaborator_view(collaborator_id: str) -> str:
    if not _require_session(collaborator_id):
        return redirect(url_for("login", next=collaborator_id))
    portal = collaborator_portals[collaborator_id]
    collaborator = portal.collaborator
    entries = sorted(collaborator.history.time_entries, key=lambda e: e.day, reverse=True)
    today = date.today()
    return render_template(
        "collaborator.html",
        collaborator=collaborator,
        summary=portal.week_summary(_current_week_start()),
        balance=portal.balance_overview(),
        indicator=portal.weekly_indicator(_current_week_start()),
        entries=entries,
        requests=portal.request_history(),
        RequestType=RequestType,
        action_state=portal.action_availability(today),
        today=today,
    )


@app.post("/colaborador/<collaborator_id>/marcar")
def collaborator_mark(collaborator_id: str):  # type: ignore[override]
    if not _require_session(collaborator_id):
        return redirect(url_for("login", next=collaborator_id))
    portal = collaborator_portals[collaborator_id]
    action = request.form.get("action")
    note = request.form.get("note") or None
    now = datetime.now()
    try:
        if action == "entrada":
            portal.mark_check_in(now, note)
        elif action == "descanso_inicio":
            portal.mark_break_start(now, note)
        elif action == "descanso_fin":
            portal.mark_break_end(now, note)
        elif action == "salida":
            portal.mark_check_out(now, note)
        else:
            flash("Acción desconocida", "error")
    except FlowError as exc:
        flash(str(exc), "error")
    else:
        flash("Marcación registrada", "success")
    return redirect(url_for("collaborator_view", collaborator_id=collaborator_id))


@app.post("/colaborador/<collaborator_id>/solicitud")
def collaborator_request(collaborator_id: str):  # type: ignore[override]
    if not _require_session(collaborator_id):
        return redirect(url_for("login", next=collaborator_id))
    portal = collaborator_portals[collaborator_id]
    request_type = RequestType(request.form["request_type"])
    payload: Dict[str, str] = {}
    start = request.form.get("start")
    end = request.form.get("end")
    hours = request.form.get("hours")
    activity = request.form.get("activity")
    notes = request.form.get("notes")
    if start:
        payload["inicio"] = start
    if end:
        payload["fin"] = end
    if hours:
        payload["horas"] = hours
    if activity:
        payload["actividad"] = activity
    if notes:
        payload["notas"] = notes
    portal.create_request(request_type, payload)
    flash("Solicitud enviada", "success")
    return redirect(url_for("collaborator_view", collaborator_id=collaborator_id))


@app.route("/admin")
def admin_view() -> str:
    pending = admin_portal.pending_requests()
    today = date.today()
    calendar = admin_portal.build_calendar(today.month, today.year)
    return render_template(
        "admin.html",
        requests=pending,
        calendar=calendar,
        summary=admin_portal.hours_balance_summary(),
        holidays=admin_portal.list_holidays(),
        access_requests=sorted(
            access_requests.values(), key=lambda req: req.created_at, reverse=True
        ),
        AccessStatus=AccessStatus,
        Role=Role,
    )


@app.post("/admin/solicitudes/<request_id>")
def admin_request_action(request_id: str):  # type: ignore[override]
    admin_portal.ingest_requests()
    target = next((req for req in admin_portal.requests if req.request_id == request_id), None)
    if not target:
        flash("Solicitud no encontrada", "error")
        return redirect(url_for("admin_view"))
    action = request.form.get("action")
    comment = request.form.get("comment") or None
    try:
        admin_portal.review_request(target, action or "", "Admin Demo", comment)
    except ValueError as exc:
        flash(str(exc), "error")
    else:
        flash("Solicitud actualizada", "success")
    return redirect(url_for("admin_view"))


@app.post("/admin/feriados")
def admin_create_holiday():  # type: ignore[override]
    name = request.form.get("name")
    day = request.form.get("day")
    paid = request.form.get("paid") == "on"
    compensable = request.form.get("compensable") == "on"
    if not name or not day:
        flash("Nombre y fecha son obligatorios", "error")
        return redirect(url_for("admin_view"))
    admin_portal.create_holiday(
        name=name,
        day=datetime.fromisoformat(f"{day}T00:00:00").date(),
        paid=paid,
        compensable=compensable,
    )
    flash("Feriado agregado", "success")
    return redirect(url_for("admin_view"))


@app.post("/admin/accesos/<path:email>")
def admin_access_decision(email: str):  # type: ignore[override]
    access_request = access_requests.get(email.lower())
    if not access_request:
        flash("Solicitud de acceso no encontrada", "error")
        return redirect(url_for("admin_view"))
    action = request.form.get("action")
    reviewer = "Admin Demo"
    position = request.form.get("position") or None
    role_value = request.form.get("role") or Role.COLLABORATOR.value
    collaborator = collaborators_by_email.get(email.lower())
    if collaborator:
        collaborator.position = position or collaborator.position
        collaborator.role = Role(role_value)
    access_request.position = position or access_request.position
    access_request.desired_role = Role(role_value)
    if action == "approve":
        access_request.approve(reviewer)
        flash("Acceso aprobado", "success")
    elif action == "deny":
        access_request.deny(reviewer)
        flash("Acceso denegado", "info")
    else:
        flash("Acción inválida", "error")
    return redirect(url_for("admin_view"))


def _build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="UI demo para App Kimce")
    parser.add_argument("--host", default="127.0.0.1", help="Host a exponer (usar 0.0.0.0 para compartir en la red)")
    parser.add_argument("--port", default=5000, type=int, help="Puerto HTTP para el servidor web")
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Activa el modo debug de Flask (recarga automática y debugger)",
    )
    return parser


def _print_access_message(host: str, port: int) -> None:
    base_url = f"http://{host}:{port}"
    print(f"\n📎 UI disponible en: {base_url}\n")
    if host == "0.0.0.0":
        try:
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)
            print(
                "Comparte este enlace dentro de tu red local: "
                f"http://{ip_address}:{port} (reemplaza por la IP pública si lo necesitas).\n"
            )
        except OSError:
            print("Comparte la IP de tu máquina seguido del puerto configurado.\n")


if __name__ == "__main__":
    args = _build_argument_parser().parse_args()
    _print_access_message(args.host, args.port)
    app.run(debug=args.debug, host=args.host, port=args.port)
