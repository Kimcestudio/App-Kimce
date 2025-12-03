"""Modelos base para la app de gestión interna Kimce."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
from enum import Enum
from typing import Dict, List, Optional
from uuid import uuid4


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


class Role(str, Enum):
    COLLABORATOR = "colaborador"
    ADMIN = "admin"


class WorkModality(str, Enum):
    """Modalidad laboral para el perfil del colaborador."""

    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    PROJECT = "proyecto"


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
    break_periods: List[tuple[datetime, datetime]] = field(default_factory=list)
    ongoing_break_start: Optional[datetime] = None
    check_out: Optional[datetime] = None
    notes: List[str] = field(default_factory=list)

    def add_note(self, note: str) -> None:
        self.notes.append(note)

    def worked_timedelta(self) -> timedelta:
        """Devuelve el tiempo efectivo trabajado descontando descansos."""

        if not self.check_in or not self.check_out:
            return timedelta(0)

        total = self.check_out - self.check_in
        for start, end in self.break_periods:
            total -= end - start
        if self.ongoing_break_start:
            total -= datetime.utcnow() - self.ongoing_break_start
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
class Document:
    """Documento asociado al expediente del colaborador."""

    name: str
    kind: str
    uploaded_at: datetime
    version: str = "v1"
    url: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class Evaluation:
    """Evaluación interna del colaborador."""

    period: str  # ej. "2024-Q2"
    self_review: Optional[str] = None
    leader_review: Optional[str] = None
    score: Optional[float] = None
    reviewer: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class KPIRecord:
    """Indicadores clave por colaborador y ciclo."""

    period: str  # ej. "2024-09"
    hours_worked: float
    hours_expected: float
    punctuality: float
    project_compliance: float
    qualitative_score: float


class NotificationCategory(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ALERT = "alert"


@dataclass
class Notification:
    """Avisos internos dirigidos a un colaborador."""

    message: str
    category: NotificationCategory
    created_at: datetime
    collaborator_id: Optional[str] = None
    read: bool = False


@dataclass
class Announcement:
    """Anuncios globales para el equipo."""

    title: str
    body: str
    created_at: datetime
    category: NotificationCategory = NotificationCategory.INFO


@dataclass
class Request:
    """Solicitud emitida por un colaborador."""

    collaborator_id: str
    request_type: RequestType
    created_at: datetime
    payload: Dict[str, str]
    request_id: str = field(default_factory=lambda: uuid4().hex)
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
    email: str
    position: Optional[str] = None
    area: Optional[str] = None
    modality: WorkModality = WorkModality.FULL_TIME
    start_date: Optional[date] = None
    phone: Optional[str] = None
    role: Role = Role.COLLABORATOR
    weekday_hours: Dict[int, timedelta] = field(default_factory=dict)
    documents: List[Document] = field(default_factory=list)
    evaluations: List[Evaluation] = field(default_factory=list)
    kpis: List[KPIRecord] = field(default_factory=list)
    history: CollaboratorHistory = field(init=False)

    def __post_init__(self) -> None:
        self.history = CollaboratorHistory(collaborator_id=self.collaborator_id)
        if not self.weekday_hours:
            standard_week = {i: timedelta(hours=8) for i in range(5)}
            standard_week[5] = timedelta(hours=4)
            self.weekday_hours = standard_week

    def expected_hours_for_day(self, day: date) -> timedelta:
        """Devuelve la expectativa para un día concreto (HH:MM)."""

        return self.weekday_hours.get(day.weekday(), timedelta(0))

    def expected_hours_between(self, start: date, end: date) -> timedelta:
        return sum((self.expected_hours_for_day(day) for day in self._iter_workdays(start, end)), timedelta())

    @staticmethod
    def _iter_workdays(start: date, end: date):
        current = start
        while current <= end:
            if current.weekday() <= 5:  # Monday-Saturday
                yield current
            current += timedelta(days=1)
