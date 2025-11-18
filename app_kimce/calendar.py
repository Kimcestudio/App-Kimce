"""Tablero de calendario consolidado."""
from __future__ import annotations

from collections import defaultdict
from datetime import date
from typing import Dict, Iterable, List

from .models import CalendarEvent, Collaborator, Holiday


class CalendarBoard:
    """Construye vistas del calendario mensual y semanal."""

    def __init__(self, collaborators: Iterable[Collaborator], holidays: Iterable[Holiday], events: Iterable[CalendarEvent]):
        self.collaborators = list(collaborators)
        self.holidays = list(holidays)
        self.events = list(events)

    def by_collaborator(self, collaborator_id: str) -> List[CalendarEvent]:
        return sorted(
            [event for event in self.events if event.collaborator_id == collaborator_id],
            key=lambda event: event.start,
        )

    def monthly_overview(self, month: int, year: int) -> Dict[str, List[CalendarEvent]]:
        overview: Dict[str, List[CalendarEvent]] = defaultdict(list)
        for event in self.events:
            if event.start.month == month and event.start.year == year:
                overview[event.collaborator_id or "general"].append(event)
        for collaborator in self.collaborators:
            for entry in collaborator.history.time_entries:
                if entry.day.month == month and entry.day.year == year and entry.check_in and entry.check_out:
                    overview[collaborator.collaborator_id].append(
                        CalendarEvent(
                            title="Jornada",
                            start=entry.check_in,
                            end=entry.check_out,
                            collaborator_id=collaborator.collaborator_id,
                        )
                    )
        for holiday in self.holidays:
            if holiday.day.month == month and holiday.day.year == year:
                overview["general"].append(
                    CalendarEvent(
                        title=f"Feriado: {holiday.name}",
                        start=holiday.day,
                        end=holiday.day,
                    )
                )
        for events in overview.values():
            events.sort(key=lambda event: event.start)
        return overview

    def team_load_for_day(self, day: date) -> Dict[str, int]:
        load = defaultdict(int)
        for collaborator in self.collaborators:
            load[collaborator.collaborator_id] += sum(1 for entry in collaborator.history.time_entries if entry.day == day)
        return load
