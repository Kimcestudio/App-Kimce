import { type Notification, type Request } from "./types";

export const demoNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "team",
    title: "Solicitudes nuevas",
    body: "Luis solicitó 4h extra para activación.",
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-2",
    userId: "team",
    title: "Vacaciones próximas",
    body: "Ana tiene vacaciones desde el 18 de julio.",
    createdAt: new Date().toISOString()
  },
  {
    id: "notif-3",
    userId: "team",
    title: "Documentos internos",
    body: "Se actualizó el reglamento interno.",
    createdAt: new Date().toISOString()
  }
];

export const demoRequests: Request[] = [
  {
    id: "req-1",
    userId: "demo-collab",
    type: "VACATION",
    startDate: "2024-07-18",
    endDate: "2024-07-20",
    reason: "Descanso anual",
    status: "PENDING",
    createdAt: new Date().toISOString()
  },
  {
    id: "req-2",
    userId: "demo-collab",
    type: "HOURS_PERMISSION",
    startDate: "2024-07-10",
    startTime: "10:00",
    endTime: "12:00",
    reason: "Trámite personal",
    status: "PENDING",
    createdAt: new Date().toISOString()
  }
];

export const demoUpcomingEvents = [
  {
    id: "event-1",
    date: "Jue 18 Jul",
    time: "04:00 PM",
    title: "Activación cliente Gotza",
    owner: "Luis Gómez"
  },
  {
    id: "event-2",
    date: "Vie 20 Jul",
    time: "09:00 AM",
    title: "Reunión interna",
    owner: "Alo Benavides"
  }
];
