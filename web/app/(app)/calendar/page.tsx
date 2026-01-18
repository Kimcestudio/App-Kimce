"use client";

import { useState } from "react";

export default function CalendarPage() {
  const [showHolidays, setShowHolidays] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Calendario</h2>
            <p className="mt-1 text-sm text-slate-500">Vista mensual con feriados, eventos y actividades.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={showHolidays} onChange={() => setShowHolidays(!showHolidays)} />
              Feriados
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} />
              Eventos internos
            </label>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <div className="grid grid-cols-7 gap-4 text-center text-xs text-slate-500">
          {Array.from({ length: 30 }, (_, index) => (
            <div key={index} className="rounded-2xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{index + 1}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {showHolidays && index % 7 === 0 ? (
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                ) : null}
                {showEvents && index % 5 === 0 ? (
                  <span className="h-2 w-2 rounded-full bg-kimce-500" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Detalle del día</p>
          <p className="text-xs text-slate-500">Horas trabajadas: 08:00 · Eventos: Activación interna</p>
        </div>
      </div>
    </div>
  );
}
