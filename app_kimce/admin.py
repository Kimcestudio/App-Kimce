"""Operaciones de Portal Admin."""
from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Dict, Iterable, List, Optional

from .models import (
    CalendarEvent,
    Collaborator,
    Holiday,
    Request,
    RequestStatus,
    RequestType,
    TimeEntry,
)


class AdminPortal:
    """API administrativa para gestionar el equipo."""

    def __init__(self, collaborators: Iterable[Collaborator]):
        self.collaborators = {c.collaborator_id: c for c in collaborators}
        self.holidays: List[Holiday] = []
        self.requests: List[Request] = []
        self.calendar_events: List[CalendarEvent] = []

    # --- Gestión de feriados ---------------------------------------------
    def create_holiday(
        self,
        *,
        name: str,
        day: date,
        paid: bool = True,
        compensable: bool = False,
        collaborators: Optional[List[str]] = None,
    ) -> Holiday:
        holiday = Holiday(name=name, day=day, paid=paid, compensable=compensable, collaborators=collaborators)
        self.holidays.append(holiday)
        return holiday

    def remove_holiday(self, name: str, day: date) -> None:
        self.holidays = [h for h in self.holidays if not (h.name == name and h.day == day)]

    def list_holidays(self) -> List[Holiday]:
        return sorted(self.holidays, key=lambda h: h.day)

    # --- Solicitudes -----------------------------------------------------
    def ingest_requests(self) -> None:
        """Carga todas las solicitudes pendientes de los colaboradores."""
        self.requests = [
            request
            for collaborator in self.collaborators.values()
            for request in collaborator.history.requests
            if request.status == RequestStatus.PENDING
        ]

    def review_request(self, request: Request, action: str, reviewer: str, comment: str | None = None) -> None:
        if action == "approve":
            request.approve(reviewer)
            self._post_approval_effect(request)
        elif action == "reject" and comment:
            request.reject(reviewer, comment)
        elif action == "correction" and comment:
            request.ask_correction(reviewer, comment)
        else:
            raise ValueError("Acción inválida o sin comentario requerido")

    def _post_approval_effect(self, request: Request) -> None:
        collaborator = self.collaborators[request.collaborator_id]
        payload = request.payload
        if request.request_type == RequestType.OVERTIME:
            hours = float(payload.get("horas", 0))
            collaborator.history.hours_balance += timedelta(hours=hours)
        elif request.request_type == RequestType.CREDIT_USAGE:
            hours = float(payload.get("horas", 0))
            collaborator.history.hours_balance -= timedelta(hours=hours)
        elif request.request_type in {RequestType.VACATION, RequestType.COMP_DAY, RequestType.PERMIT}:
            start = datetime.fromisoformat(payload["inicio"])
            end = datetime.fromisoformat(payload["fin"])
            self.calendar_events.append(
                CalendarEvent(
                    title=f"{request.request_type.value.title()} - {collaborator.full_name}",
                    start=start,
                    end=end,
                    collaborator_id=collaborator.collaborator_id,
                    metadata={"tipo": request.request_type.value},
                )
            )
        elif request.request_type == RequestType.SPECIAL_ACTIVITY:
            start = datetime.fromisoformat(payload["inicio"])
            end = datetime.fromisoformat(payload["fin"])
            self.calendar_events.append(
                CalendarEvent(
                    title=f"Actividad {payload.get('actividad', 'especial')} - {collaborator.full_name}",
                    start=start,
                    end=end,
                    collaborator_id=collaborator.collaborator_id,
                    metadata=payload,
                )
            )

    # --- Ajustes manuales ------------------------------------------------
    def adjust_hours(self, collaborator_id: str, delta_hours: float) -> None:
        collaborator = self.collaborators[collaborator_id]
        collaborator.history.hours_balance += timedelta(hours=delta_hours)

    def fix_time_entry(self, collaborator_id: str, entry: TimeEntry) -> None:
        collaborator = self.collaborators[collaborator_id]
        collaborator.history.add_entry(entry)

    # --- Calendario ------------------------------------------------------
    def build_calendar(self, month: int, year: int) -> List[CalendarEvent]:
        events = [event for event in self.calendar_events if event.start.month == month and event.start.year == year]
        for collaborator in self.collaborators.values():
            for entry in collaborator.history.time_entries:
                if entry.day.month == month and entry.day.year == year and entry.check_in and entry.check_out:
                    events.append(
                        CalendarEvent(
                            title=f"Jornada {collaborator.full_name}",
                            start=entry.check_in,
                            end=entry.check_out,
                            collaborator_id=collaborator.collaborator_id,
                        )
                    )
        for holiday in self.holidays:
            if holiday.day.month == month and holiday.day.year == year:
                events.append(
                    CalendarEvent(
                        title=f"Feriado: {holiday.name}",
                        start=datetime.combine(holiday.day, datetime.min.time()),
                        end=datetime.combine(holiday.day, datetime.max.time()),
                        metadata={"paid": str(holiday.paid), "compensable": str(holiday.compensable)},
                    )
                )
        return sorted(events, key=lambda e: e.start)

    # --- Reportes --------------------------------------------------------
    def pending_requests(self) -> List[Request]:
        self.ingest_requests()
        return self.requests

    def punctuality_ranking(self) -> List[Dict[str, float]]:
        ranking: List[Dict[str, float]] = []
        for collaborator in self.collaborators.values():
            entries = [entry for entry in collaborator.history.time_entries if entry.check_in]
            if not entries:
                continue
            on_time = sum(1 for entry in entries if entry.check_in.time() <= datetime.combine(entry.day, datetime.min.time()).time())
            ranking.append(
                {
                    "colaborador": collaborator.full_name,
                    "porcentaje_puntualidad": round(on_time / len(entries) * 100, 2),
                }
            )
        return sorted(ranking, key=lambda item: item["porcentaje_puntualidad"], reverse=True)

    def hours_balance_summary(self) -> Dict[str, float]:
        total_balance = sum((c.history.hours_balance for c in self.collaborators.values()), timedelta())
        return {
            "horas_a_favor": max(0.0, total_balance.total_seconds() / 3600),
            "horas_deuda": max(0.0, -total_balance.total_seconds() / 3600),
        }

    def export_history(self, collaborator_id: str) -> List[Dict[str, str]]:
        collaborator = self.collaborators[collaborator_id]
        return [
            {
                "dia": entry.day.isoformat(),
                "entrada": entry.check_in.isoformat() if entry.check_in else "",
                "salida": entry.check_out.isoformat() if entry.check_out else "",
                "horas": f"{entry.worked_timedelta().total_seconds() / 3600:.2f}",
            }
            for entry in collaborator.history.time_entries
        ]
