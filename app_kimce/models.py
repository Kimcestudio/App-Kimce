"""Modelos base para la app de gestión interna Kimce."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
from enum import Enum
from typing import Dict, List, Optional


class RequestType(str, Enum):
    """Tipos de solicitudes que se pueden cursar."""

    VACATION = "vacaciones"
    COMP_DAY = "dia_compensatorio"
    PERMIT = "permiso"
    OVERTIME = "horas_extra"
    CREDIT_USAGE = "uso_horas_a_favor"
    SPECIAL_ACTIVITY = "actividad_especial"


class RequestStatus(str, Enum):
    """Estado de una solicitud."""

    PENDING = "pendiente"
    APPROVED = "aprobada"
    REJECTED = "rechazada"
    CORRECTION = "correccion"


class ActivityType(str, Enum):
    """Tipo de actividad especial registrada."""

    ACTIVATION = "activacion"
    RECORDING = "grabacion"
    CLIENT_MEETING = "reunion_cliente"
    EVENT = "evento"
    TRAINING = "capacitacion"
    OTHER = "otra"


@dataclass
class TimeEntry:
    """Representa un día laboral con sus hitos."""

    day: date
    check_in: Optional[datetime] = None
    break_start: Optional[datetime] = None
    break_end: Optional[datetime] = None
    check_out: Optional[datetime] = None
    notes: List[str] = field(default_factory=list)

    def add_note(self, note: str) -> None:
        self.notes.append(note)

    def worked_timedelta(self) -> timedelta:
        """Devuelve el tiempo efectivo trabajado descontando descansos."""

        if not self.check_in or not self.check_out:
            return timedelta(0)

        total = self.check_out - self.check_in
        if self.break_start and self.break_end:
            total -= self.break_end - self.break_start
        return total


@dataclass
class Holiday:
    """Feriado o día especial configurable."""

    name: str
    day: date
    paid: bool = True
    compensable: bool = False
    collaborators: Optional[List[str]] = None

    def applies_to(self, collaborator_id: str) -> bool:
        return not self.collaborators or collaborator_id in self.collaborators


@dataclass
class CalendarEvent:
    """Evento consolidado para el calendario."""

    title: str
    start: datetime
    end: datetime
    collaborator_id: Optional[str] = None
    metadata: Dict[str, str] = field(default_factory=dict)


@dataclass
class Request:
    """Solicitud emitida por un colaborador."""

    collaborator_id: str
    request_type: RequestType
    created_at: datetime
    payload: Dict[str, str]

    status: RequestStatus = RequestStatus.PENDING
    reviewer: Optional[str] = None
    comments: List[str] = field(default_factory=list)

    def approve(self, reviewer: str) -> None:
        self.status = RequestStatus.APPROVED
        self.reviewer = reviewer

    def reject(self, reviewer: str, comment: str) -> None:
        self.status = RequestStatus.REJECTED
        self.reviewer = reviewer
        self.comments.append(comment)

    def ask_correction(self, reviewer: str, comment: str) -> None:
        self.status = RequestStatus.CORRECTION
        self.reviewer = reviewer
        self.comments.append(comment)


@dataclass
class CollaboratorHistory:
    """Historial consolidado de un colaborador."""

    collaborator_id: str
    time_entries: List[TimeEntry] = field(default_factory=list)
    requests: List[Request] = field(default_factory=list)
    hours_balance: timedelta = timedelta(0)

    def add_entry(self, entry: TimeEntry) -> None:
        existing = next((e for e in self.time_entries if e.day == entry.day), None)
        if existing:
            self.time_entries[self.time_entries.index(existing)] = entry
        else:
            self.time_entries.append(entry)

    def add_request(self, request: Request) -> None:
        self.requests.append(request)

    def worked_hours_between(self, start: date, end: date) -> timedelta:
        total = timedelta(0)
        for entry in self.time_entries:
            if start <= entry.day <= end:
                total += entry.worked_timedelta()
        return total


@dataclass
class Collaborator:
    """Representa a un colaborador activo."""

    collaborator_id: str
    full_name: str
    expected_daily_hours: timedelta
    history: CollaboratorHistory = field(init=False)

    def __post_init__(self) -> None:
        self.history = CollaboratorHistory(collaborator_id=self.collaborator_id)

    def expected_hours_between(self, start: date, end: date) -> timedelta:
        days = sum(1 for _ in self._iter_workdays(start, end))
        return self.expected_daily_hours * days

    @staticmethod
    def _iter_workdays(start: date, end: date):
        current = start
        while current <= end:
            if current.weekday() < 5:  # Monday-Friday
                yield current
            current += timedelta(days=1)
