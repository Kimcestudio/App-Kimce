"use client";

import { useState } from "react";

export default function RequestsPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries()))
    });

    if (!response.ok) {
      setMessage("No se pudo crear la solicitud.");
      return;
    }

    form.reset();
    setMessage("Solicitud creada. Espera aprobación.");
  }

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Solicitudes</h2>
        <p className="mt-1 text-sm text-slate-500">Crea vacaciones, permisos u horas extra.</p>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</label>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" name="type" required>
              <option value="VACATION">Vacaciones</option>
              <option value="DAY_OFF">Día libre</option>
              <option value="HOURS_PERMISSION">Permiso por horas</option>
              <option value="MEDICAL">Médico</option>
              <option value="REMOTE_WORK">Trabajo remoto</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Motivo</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" name="reason" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inicio</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" name="startDate" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fin</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" name="endDate" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hora inicio</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="time" name="startTime" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hora fin</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="time" name="endTime" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Adjunto (URL)</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" name="attachmentUrl" placeholder="https://" />
          </div>
          <div className="lg:col-span-2">
            <button className="pill-button pill-primary" type="submit">Enviar solicitud</button>
          </div>
        </form>
        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="card p-8">
        <h3 className="section-title">Historial reciente</h3>
        <div className="mt-4 space-y-3">
          {["Vacaciones", "Permiso horas"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item}</p>
                <p className="text-xs text-slate-500">Pendiente</p>
              </div>
              <span className="badge badge-warning">PENDING</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
