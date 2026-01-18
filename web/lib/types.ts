export type Role = "ADMIN" | "COLLABORATOR" | "LEAD";

export type AttendanceStatus = "OPEN" | "CLOSED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ExtraActivityStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string | null;
  breaks: { startAt: string; endAt?: string | null }[];
  notes?: string;
  totalMinutes?: number;
  lateMinutes?: number;
  status: AttendanceStatus;
}

export interface CorrectionRequest {
  id: string;
  attendanceId: string;
  userId: string;
  proposedData: Record<string, unknown>;
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ExtraActivity {
  id: string;
  userId: string;
  date: string;
  startAt?: string;
  endAt?: string;
  minutes: number;
  type: string;
  projectId?: string;
  description: string;
  evidenceUrl?: string;
  status: ExtraActivityStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Request {
  id: string;
  userId: string;
  type: "VACATION" | "DAY_OFF" | "HOURS_PERMISSION" | "MEDICAL" | "REMOTE_WORK";
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  attachmentUrl?: string;
  status: RequestStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  country?: string;
  appliesToAll: boolean;
}

export interface Event {
  id: string;
  startAt: string;
  endAt?: string;
  title: string;
  description?: string;
  visibility: "TEAM" | "ADMIN" | "PUBLIC";
  createdBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  scheduleId?: string;
  position?: string;
  avatarUrl?: string;
  statusActive: boolean;
}

export interface Schedule {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  breakPolicy?: string;
}

export interface Policy {
  id: string;
  lateToleranceMinutes: number;
  vacationMinNoticeDays: number;
}

export interface PaymentCycle {
  id: string;
  month: number;
  year: number;
  status: "PENDING" | "PAID";
}

export interface PaymentItem {
  id: string;
  cycleId: string;
  userId: string;
  baseAmount: number;
  variableAmount: number;
  bonuses: number;
  deductions: number;
  total: number;
  status: "PENDING" | "PAID";
  paidAt?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
}
