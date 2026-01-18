import Link from "next/link";
import { Calendar, CheckCircle2, ClipboardCheck, Clock, PlusCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { demoNotifications, demoRequests, demoUpcomingEvents } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role ?? "COLLABORATOR";

  return role === "ADMIN" ? <AdminDashboard /> : <CollaboratorDashboard />;
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[7fr_5fr]">
        <div className="card p-8">
          <h2 className="text-3xl font-semibold text-slate-900">Hola, Ana Pérez</h2>
          <p className="mt-2 text-sm text-slate-500">
            Este es el estado general del equipo y tus pendientes de administración.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="badge badge-success">
              <CheckCircle2 className="h-4 w-4" /> Activos ahora 12
            </span>
            <span className="badge badge-warning">
              <Clock className="h-4 w-4" /> Solicitudes pendientes 6
            </span>
            <span className="badge badge-info">
              <ClipboardCheck className="h-4 w-4" /> Accesos pendientes 3
            </span>
          </div>
        </div>
        <div className="card flex flex-col justify-between p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Ilustración
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Gestiona tu equipo con claridad
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Controla horarios, solicitudes y eventos en un solo lugar.
            </p>
          </div>
          <div className="mt-6 h-32 rounded-3xl bg-gradient-to-br from-kimce-100 via-white to-emerald-100" />
        </div>
      </section>

      <section className="card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">Semana del equipo</h3>
            <p className="subtitle">Horas trabajadas vs esperadas (semanal)</p>
          </div>
          <Link className="text-sm font-semibold text-kimce-600" href="/admin/reports">
            Ver detalle
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          {[
            { label: "Trabajadas", value: "312h" },
            { label: "Esperadas", value: "340h" },
            { label: "Horas extra", value: "+12h" },
            { label: "Saldo", value: "-8h" }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 h-2 rounded-full bg-slate-100">
          <div className="h-2 w-[82%] rounded-full bg-emerald-400" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Notificaciones importantes</h3>
          <div className="mt-4 space-y-4">
            {demoNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="text-xs text-slate-500">{notification.body}</p>
                </div>
                <button className="text-xs font-semibold text-kimce-600">Ver</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Calendario rápido</h3>
            <Link className="text-sm font-semibold text-kimce-600" href="/calendar">
              Calendario completo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs text-slate-500">
            {Array.from({ length: 30 }, (_, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 py-2">
                <p className="font-semibold text-slate-700">{index + 1}</p>
                <div className="mt-1 flex justify-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-kimce-400" />
                  {index % 5 === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Acciones rápidas</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="pill-button pill-warning" href="/admin/approvals">
              <ClipboardCheck className="h-4 w-4" /> Revisar solicitudes
            </Link>
            <Link className="pill-button pill-warning" href="/admin/approvals">
              <CheckCircle2 className="h-4 w-4" /> Revisar accesos
            </Link>
            <Link className="pill-button pill-secondary" href="/admin/calendar">
              <Calendar className="h-4 w-4" /> Crear feriado
            </Link>
            <Link className="pill-button pill-secondary" href="/admin/calendar">
              <PlusCircle className="h-4 w-4" /> Asignar vacaciones
            </Link>
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">KPIs rápidos</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Horas marcadas", value: "92%", color: "text-kimce-600" },
              { label: "Solicitudes", value: "76%", color: "text-amber-500" },
              { label: "Accesos", value: "88%", color: "text-emerald-500" },
              { label: "Activos", value: "12", color: "text-violet-500" }
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl bg-slate-50 p-4">
                <p className={`text-xl font-semibold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Eventos próximos</h3>
          <div className="mt-4 space-y-4">
            {demoUpcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">{event.date} · {event.time}</p>
                  <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">Responsable: {event.owner}</p>
                </div>
                <div className="flex gap-2">
                  <button className="pill-button pill-secondary text-xs">Ver</button>
                  <button className="pill-button pill-secondary text-xs">Reprogramar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Solicitudes recientes</h3>
            <Link className="text-sm font-semibold text-kimce-600" href="/requests">
              Ver historial
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {demoRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{request.type}</p>
                  <p className="text-xs text-slate-500">{request.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button className="pill-button pill-success text-xs">Aprobar</button>
                  <button className="pill-button pill-danger text-xs">Denegar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-8">
        <h3 className="section-title">Accesos y roles</h3>
        <div className="mt-4 space-y-3">
          {["Sofía Torres", "Martín Silva"].map((name) => (
            <div key={name} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{name.toLowerCase().replace(" ", ".")}@kimce.studio</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs">
                  <option>COLLABORATOR</option>
                  <option>ADMIN</option>
                  <option>LEAD</option>
                </select>
                <button className="pill-button pill-success text-xs">Aprobar</button>
                <button className="pill-button pill-danger text-xs">Denegar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CollaboratorDashboard() {
  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h2 className="text-3xl font-semibold text-slate-900">Hola, Luis 👋</h2>
        <p className="mt-2 text-sm text-slate-500">Aquí tienes tu resumen de hoy en Kimce.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="pill-button pill-primary">
            Marcar ingreso/salida
          </button>
          <Link className="pill-button pill-secondary" href="/attendance">
            Ver asistencia
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          { label: "Horas de hoy", value: "06:30" },
          { label: "Horas semana", value: "28:00" },
          { label: "Horas mes", value: "98:30" }
        ].map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Notificaciones importantes</h3>
          <div className="mt-4 space-y-4">
            {demoNotifications.slice(0, 2).map((notification) => (
              <div key={notification.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                <p className="text-xs text-slate-500">{notification.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Mini calendario</h3>
            <Link className="text-sm font-semibold text-kimce-600" href="/calendar">
              Ver calendario
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3 text-center text-xs text-slate-500">
            {Array.from({ length: 30 }, (_, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 py-2">
                <p className="font-semibold text-slate-700">{index + 1}</p>
                <div className="mt-1 flex justify-center gap-1">
                  {index % 4 === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Acciones rápidas</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="pill-button pill-primary" href="/attendance">
              <Clock className="h-4 w-4" /> Fichar entrada
            </Link>
            <Link className="pill-button pill-secondary" href="/activities">
              <PlusCircle className="h-4 w-4" /> Crear actividad extra
            </Link>
            <Link className="pill-button pill-secondary" href="/requests">
              <ClipboardCheck className="h-4 w-4" /> Ver solicitudes
            </Link>
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">KPIs rápidos</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Puntualidad", value: "92%" },
              { label: "Horas cumplidas", value: "88%" },
              { label: "Actividades extra", value: "3" },
              { label: "Días sin marcar", value: "1" }
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xl font-semibold text-kimce-600">{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Eventos próximos</h3>
          <div className="mt-4 space-y-4">
            {demoUpcomingEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{event.date} · {event.time}</p>
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">Solicitudes recientes</h3>
          <div className="mt-4 space-y-3">
            {demoRequests.map((request) => (
              <div key={request.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{request.type}</p>
                <p className="text-xs text-slate-500">Estado: {request.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
