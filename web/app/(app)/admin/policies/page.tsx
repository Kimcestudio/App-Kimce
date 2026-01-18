export default function AdminPoliciesPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Políticas</h2>
        <p className="mt-1 text-sm text-slate-500">Configura tolerancias y reglas de la operación.</p>
      </div>
      <div className="card p-8">
        <form className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tolerancia de tardanza (min)
            </label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="number" defaultValue={10} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Días mínimos de aviso para vacaciones
            </label>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2" type="number" defaultValue={7} />
          </div>
          <div className="lg:col-span-2">
            <button className="pill-button pill-primary" type="button">Guardar políticas</button>
          </div>
        </form>
      </div>
    </div>
  );
}
