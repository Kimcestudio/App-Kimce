export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Reportes</h2>
        <p className="mt-1 text-sm text-slate-500">Descarga reportes por persona o por mes.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="pill-button pill-secondary">Exportar CSV</button>
          <button className="pill-button pill-secondary">Exportar PDF</button>
        </div>
      </div>
      <div className="card p-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { label: "Horas trabajadas", value: "1,240h" },
            { label: "Puntualidad", value: "92%" },
            { label: "Ausencias", value: "3" }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
