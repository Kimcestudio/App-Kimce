"use client";

import { useState } from "react";

export default function ActivitiesPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: payload.date,
        startAt: payload.startAt,
        endAt: payload.endAt,
        minutes: Number(payload.minutes || 0),
        type: payload.type,
        description: payload.description,
        evidenceUrl: payload.evidenceUrl
      })
    });

    if (!response.ok) {
      setMessage("No se pudo registrar la actividad.");
      return;
    }

    form.reset();
    setMessage("Actividad registrada y enviada a aprobación.");
  }

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Actividades extra</h2>
        <p className="mt-1 text-sm text-slate-500">Registra activaciones, grabaciones o reuniones fuera de horario.</p>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" name="date" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" name="type" placeholder="Activación" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inicio</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="time" name="startAt" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fin</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="time" name="endAt" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Minutos</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="number" name="minutes" placeholder="90" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidencia (URL)</label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" name="evidenceUrl" placeholder="https://" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</label>
            <textarea className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" rows={3} name="description" required />
          </div>
          <div className="lg:col-span-2">
            <button className="pill-button pill-primary" type="submit">Enviar actividad</button>
          </div>
        </form>
        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="card p-8">
        <h3 className="section-title">Historial reciente</h3>
        <div className="mt-4 space-y-3">
          {["Activación Gotza", "Grabación interna"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item}</p>
                <p className="text-xs text-slate-500">Pendiente de aprobación</p>
              </div>
              <span className="badge badge-warning">PENDING</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
