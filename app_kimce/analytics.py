"""Indicadores claves y reportes del panel de control."""
from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from typing import Dict, Iterable, List

from .models import Collaborator


class AnalyticsPanel:
    """Provee métricas agregadas del equipo."""

    def __init__(self, collaborators: Iterable[Collaborator]):
        self.collaborators = list(collaborators)

    def debt_vs_credit(self) -> Dict[str, float]:
        total_balance = sum((c.history.hours_balance for c in self.collaborators), timedelta())
        return {
            "horas_a_favor": max(0.0, total_balance.total_seconds() / 3600),
            "horas_deuda": max(0.0, -total_balance.total_seconds() / 3600),
        }

    def hours_by_project(self) -> Dict[str, float]:
        """Suma horas extra por actividad registrada en la carga de solicitudes."""

        project_hours: Dict[str, float] = defaultdict(float)
        for collaborator in self.collaborators:
            for request in collaborator.history.requests:
                if request.request_type == request.request_type.SPECIAL_ACTIVITY and request.status == request.status.APPROVED:
                    project = request.payload.get("proyecto", "sin_proyecto")
                    hours = float(request.payload.get("horas", 0))
                    project_hours[project] += hours
        return dict(project_hours)

    def team_weekly_stats(self, week_start: date) -> Dict[str, float]:
        week_end = week_start + timedelta(days=6)
        worked = sum(
            (c.history.worked_hours_between(week_start, week_end) for c in self.collaborators),
            timedelta(),
        )
        expected = sum(
            (c.expected_hours_between(week_start, week_end) for c in self.collaborators),
            timedelta(),
        )
        diff = worked - expected
        return {
            "horas_trabajadas": worked.total_seconds() / 3600,
            "horas_esperadas": expected.total_seconds() / 3600,
            "horas_extra": max(0.0, diff.total_seconds() / 3600),
            "horas_faltantes": max(0.0, -diff.total_seconds() / 3600),
        }

    def punctuality_trend(self) -> List[Dict[str, float]]:
        trend: List[Dict[str, float]] = []
        for collaborator in self.collaborators:
            entries = [entry for entry in collaborator.history.time_entries if entry.check_in]
            if not entries:
                continue
            avg_hour = sum(entry.check_in.hour for entry in entries) / len(entries)
            trend.append({"colaborador": collaborator.full_name, "hora_promedio_entrada": round(avg_hour, 2)})
        return trend
