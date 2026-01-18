"use client";

import { useState } from "react";
import { Clock, PauseCircle, PlayCircle, StopCircle } from "lucide-react";

async function postAttendance(path: string) {
  const response = await fetch(`/api/attendance/${path}`, { method: "POST" });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Error al registrar");
  }
}

export default function AttendancePage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick(path: string, success: string) {
    setMessage(null);
    try {
      await postAttendance(path);
      setMessage(success);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Asistencia</h2>
        <p className="mt-1 text-sm text-slate-500">Registra tu jornada y descansos del día.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="pill-button pill-primary" onClick={() => handleClick("check-in", "Ingreso registrado")}
            type="button">
            <Clock className="h-4 w-4" /> Check-in
          </button>
          <button className="pill-button pill-secondary" onClick={() => handleClick("break-start", "Descanso iniciado")}
            type="button">
            <PauseCircle className="h-4 w-4" /> Iniciar descanso
          </button>
          <button className="pill-button pill-secondary" onClick={() => handleClick("break-end", "Descanso finalizado")}
            type="button">
            <PlayCircle className="h-4 w-4" /> Finalizar descanso
          </button>
          <button className="pill-button pill-danger" onClick={() => handleClick("check-out", "Salida registrada")}
            type="button">
            <StopCircle className="h-4 w-4" /> Check-out
          </button>
        </div>
        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Resumen de hoy</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Estado", value: "IN_SHIFT" },
              { label: "Horas trabajadas", value: "06:30" },
              { label: "Descansos", value: "2" },
              { label: "Tardanza", value: "0 min" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">Historial reciente</h3>
          <div className="mt-4 space-y-3">
            {["Lun 01 Jul", "Mar 02 Jul", "Mié 03 Jul"].map((day) => (
              <div key={day} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{day}</p>
                  <p className="text-xs text-slate-500">08:00 - 17:00</p>
                </div>
                <span className="badge badge-success">OK</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
