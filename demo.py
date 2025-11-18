"""Ejemplo interactivo mínimo para demostrar la App Kimce."""
from __future__ import annotations

from datetime import date, datetime, timedelta

from app_kimce import (
    AdminPortal,
    AnalyticsPanel,
    Collaborator,
    CollaboratorPortal,
    RequestType,
)


def build_demo_state():
    collaborators = [
        Collaborator("c1", "Ana López", timedelta(hours=8), "ana@example.com"),
        Collaborator("c2", "Luis García", timedelta(hours=7.5), "luis@example.com"),
    ]
    portals = {c.collaborator_id: CollaboratorPortal(c) for c in collaborators}

    # Marcaciones de ejemplo
    monday = date.today()
    for collaborator_id, portal in portals.items():
        start = datetime.combine(monday, datetime.min.time()).replace(hour=9)
        portal.mark_check_in(start)
        portal.mark_break_start(start.replace(hour=13))
        portal.mark_break_end(start.replace(hour=14))
        portal.mark_check_out(start.replace(hour=18))

    # Solicitud de vacaciones y horas extra
    vacation_request = portals["c1"].create_request(
        RequestType.VACATION,
        {"inicio": datetime.now().isoformat(), "fin": (datetime.now() + timedelta(days=3)).isoformat()},
    )
    overtime_request = portals["c2"].create_request(RequestType.OVERTIME, {"horas": "2", "motivo": "Evento"})

    admin = AdminPortal(collaborators)
    admin.ingest_requests()
    for request in admin.pending_requests():
        admin.review_request(request, "approve", reviewer="RRHH", comment=None)

    analytics = AnalyticsPanel(collaborators)
    return collaborators, portals, admin, analytics


if __name__ == "__main__":
    collaborators, portals, admin, analytics = build_demo_state()
    for collaborator in collaborators:
        portal = portals[collaborator.collaborator_id]
        print(collaborator.full_name, portal.week_summary(date.today()))
    print("Pendientes:", admin.pending_requests())
    print("Horas equipo:", analytics.team_weekly_stats(date.today()))
