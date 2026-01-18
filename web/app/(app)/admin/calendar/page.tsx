export default function AdminCalendarPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Feriados y vacaciones</h2>
        <p className="mt-1 text-sm text-slate-500">Crea feriados, eventos y vacaciones del equipo.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-8">
          <h3 className="section-title">Nuevo feriado</h3>
          <form className="mt-4 space-y-3">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-2" placeholder="Nombre del feriado" />
            <button className="pill-button pill-primary" type="button">Guardar feriado</button>
          </form>
        </div>
        <div className="card p-8">
          <h3 className="section-title">Asignar vacaciones</h3>
          <form className="mt-4 space-y-3">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-2" placeholder="Colaborador" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-2" type="date" />
            <button className="pill-button pill-primary" type="button">Asignar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
