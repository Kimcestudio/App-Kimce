export default function AdminApprovalsPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Aprobaciones</h2>
        <p className="mt-1 text-sm text-slate-500">Gestiona solicitudes, actividades extra y correcciones.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Solicitudes pendientes", items: ["Vacaciones Luis", "Permiso Ana"] },
          { title: "Actividades extra", items: ["Activación Gotza", "Grabación interna"] },
          { title: "Correcciones", items: ["Check-out olvidado"] }
        ].map((section) => (
          <div key={section.title} className="card p-6">
            <h3 className="section-title">{section.title}</h3>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="pill-button pill-success text-xs">Aprobar</button>
                    <button className="pill-button pill-danger text-xs">Denegar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
