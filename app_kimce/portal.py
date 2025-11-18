"""Operaciones del Portal del Colaborador."""
from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Dict, Iterable, List, Tuple

from .models import Collaborator, Request, RequestStatus, RequestType, TimeEntry


class FlowError(RuntimeError):
    """Error cuando se intenta marcar fuera del flujo lógico."""


class CollaboratorPortal:
    """API de alto nivel para que un colaborador gestione su jornada."""

    def __init__(self, collaborator: Collaborator) -> None:
        self.collaborator = collaborator

    # --- Marcaciones -----------------------------------------------------
    def _get_entry(self, day: date) -> TimeEntry:
        entry = next((e for e in self.collaborator.history.time_entries if e.day == day), None)
        if not entry:
            entry = TimeEntry(day=day)
            self.collaborator.history.add_entry(entry)
        return entry

    def mark_check_in(self, ts: datetime, note: str | None = None) -> TimeEntry:
        entry = self._get_entry(ts.date())
        if entry.check_in:
            raise FlowError("Ya existe un registro de entrada para este día")
        entry.check_in = ts
        if note:
            entry.add_note(note)
        return entry

    def mark_break_start(self, ts: datetime, note: str | None = None) -> TimeEntry:
        entry = self._get_entry(ts.date())
        if not entry.check_in or entry.break_start:
            raise FlowError("No se puede iniciar descanso sin entrada o si ya fue registrado")
        if entry.check_out:
            raise FlowError("La jornada ya fue cerrada para este día")
        entry.break_start = ts
        if note:
            entry.add_note(note)
        return entry

    def mark_break_end(self, ts: datetime, note: str | None = None) -> TimeEntry:
        entry = self._get_entry(ts.date())
        if not entry.break_start or entry.break_end:
            raise FlowError("No se puede finalizar descanso sin inicio previo")
        if entry.check_out:
            raise FlowError("La jornada ya fue cerrada para este día")
        entry.break_end = ts
        if note:
            entry.add_note(note)
        return entry

    def mark_check_out(self, ts: datetime, note: str | None = None) -> TimeEntry:
        entry = self._get_entry(ts.date())
        if not entry.check_in:
            raise FlowError("No se puede registrar salida sin entrada")
        if entry.check_out:
            raise FlowError("La salida ya fue registrada")
        entry.check_out = ts
        if note:
            entry.add_note(note)
        return entry

    # --- Solicitudes -----------------------------------------------------
    def create_request(self, request_type: RequestType, payload: Dict[str, str]) -> Request:
        request = Request(
            collaborator_id=self.collaborator.collaborator_id,
            request_type=request_type,
            payload=payload,
            created_at=datetime.utcnow(),
        )
        self.collaborator.history.add_request(request)
        return request

    # --- Reportes --------------------------------------------------------
    def week_summary(self, week_start: date) -> Dict[str, float]:
        week_end = week_start + timedelta(days=6)
        worked = self.collaborator.history.worked_hours_between(week_start, week_end)
        expected = self.collaborator.expected_hours_between(week_start, week_end)
        difference = worked - expected
        summary = {
            "horas_trabajadas": worked.total_seconds() / 3600,
            "horas_esperadas": expected.total_seconds() / 3600,
            "horas_extra": max(0.0, difference.total_seconds() / 3600),
            "horas_faltantes": max(0.0, -difference.total_seconds() / 3600),
            "horas_a_favor": max(0.0, difference.total_seconds() / 3600),
        }
        return summary

    def request_history(self) -> List[Tuple[RequestType, RequestStatus, Dict[str, str]]]:
        return [
            (request.request_type, request.status, request.payload)
            for request in sorted(self.collaborator.history.requests, key=lambda r: r.created_at)
        ]

    def balance_overview(self) -> Dict[str, float]:
        balance = self.collaborator.history.hours_balance
        return {
            "horas_a_favor": max(0.0, balance.total_seconds() / 3600),
            "horas_deuda": max(0.0, -balance.total_seconds() / 3600),
        }

    def annotate_entry(self, day: date, note: str) -> TimeEntry:
        entry = self._get_entry(day)
        entry.add_note(note)
        return entry

    # --- Utilidades ------------------------------------------------------
    def action_availability(self, day: date) -> Dict[str, bool]:
        """Expone qué botones deben estar habilitados para un día dado."""

        entry = next((e for e in self.collaborator.history.time_entries if e.day == day), None)
        if not entry:
            return {
                "entrada": True,
                "descanso_inicio": False,
                "descanso_fin": False,
                "salida": False,
                "bloqueado": False,
            }

        locked = bool(entry.check_out)
        return {
            "entrada": entry.check_in is None,
            "descanso_inicio": bool(entry.check_in and not entry.break_start and not entry.check_out),
            "descanso_fin": bool(entry.break_start and not entry.break_end and not entry.check_out),
            "salida": bool(entry.check_in and not entry.check_out),
            "bloqueado": locked,
        }

    def weekly_indicator(self, week_start: date) -> str:
        summary = self.week_summary(week_start)
        return "verde" if summary["horas_trabajadas"] >= summary["horas_esperadas"] else "rojo"

    def aggregated_history(self) -> Dict[str, Dict[str, float]]:
        grouped: Dict[str, Dict[str, float]] = defaultdict(lambda: {"trabajadas": 0.0, "esperadas": 0.0})
        for entry in self.collaborator.history.time_entries:
            week_id = f"{entry.day.isocalendar().year}-W{entry.day.isocalendar().week:02d}"
            grouped[week_id]["trabajadas"] += entry.worked_timedelta().total_seconds() / 3600
            grouped[week_id]["esperadas"] += (
                self.collaborator.expected_daily_hours.total_seconds() / 3600
            )
        return grouped
