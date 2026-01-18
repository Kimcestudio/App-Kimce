import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold text-slate-900">Panel admin</h2>
      <p className="mt-1 text-sm text-slate-500">Accede a los módulos administrativos.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/users", label: "Usuarios" },
          { href: "/admin/policies", label: "Políticas" },
          { href: "/admin/approvals", label: "Aprobaciones" },
          { href: "/admin/reports", label: "Reportes" },
          { href: "/admin/calendar", label: "Calendario" }
        ].map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
