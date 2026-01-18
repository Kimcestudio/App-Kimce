import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className="card p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kimce-200 text-2xl font-semibold text-kimce-900">
            {user?.name?.charAt(0) ?? "K"}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">{user?.name ?? "Colaborador"}</h2>
          <p className="text-sm text-slate-500">{user?.role ?? "COLLABORATOR"}</p>
        </div>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p>Email: {user?.email ?? "correo@kimce.studio"}</p>
          <p>Puesto: Diseñador</p>
          <p>Modalidad: Full-time</p>
          <p>Horario: L-V 09:00-18:00</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="card p-8">
          <h3 className="section-title">Resumen semanal</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Horas trabajadas", value: "28:00" },
              { label: "Horas esperadas", value: "32:00" },
              { label: "Saldo", value: "-4:00" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">Documentos</h3>
          <div className="mt-4 space-y-3">
            {["Contrato 2024", "Reglamento interno"].map((doc) => (
              <div key={doc} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">{doc}</span>
                <button className="pill-button pill-secondary text-xs">Descargar</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="section-title">Notificaciones</h3>
          <div className="mt-4 space-y-3">
            {["Vacaciones aprobadas", "Actividad extra pendiente"].map((note) => (
              <div key={note} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{note}</p>
                <p className="text-xs text-slate-500">Hace 2 días</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
