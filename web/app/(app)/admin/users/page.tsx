export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Equipo</h2>
        <p className="mt-1 text-sm text-slate-500">Gestiona roles, horarios y acceso del equipo.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            { name: "Luis Gómez", role: "COLLABORATOR" },
            { name: "Ana Pérez", role: "ADMIN" }
          ].map((user) => (
            <div key={user.name} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
              <button className="mt-3 pill-button pill-secondary text-xs">Ver perfil</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-8">
        <h3 className="section-title">Nuevo colaborador</h3>
        <form className="mt-4 grid gap-4 lg:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-2" placeholder="Nombre" />
          <input className="rounded-2xl border border-slate-200 px-4 py-2" placeholder="Email" />
          <select className="rounded-2xl border border-slate-200 px-4 py-2">
            <option>COLLABORATOR</option>
            <option>ADMIN</option>
            <option>LEAD</option>
          </select>
          <input className="rounded-2xl border border-slate-200 px-4 py-2" placeholder="Horario" />
          <button className="pill-button pill-primary" type="button">Guardar</button>
        </form>
      </div>
    </div>
  );
}
