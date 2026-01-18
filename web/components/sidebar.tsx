import Link from "next/link";
import { Calendar, ClipboardList, CreditCard, FolderKanban, LayoutGrid, LogOut, Shield, Users } from "lucide-react";
import type { Role } from "@/lib/types";

const adminItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/users", label: "Equipo", icon: Users },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/requests", label: "Solicitudes", icon: ClipboardList },
  { href: "/admin/calendar", label: "Feriados y vacaciones", icon: Calendar },
  { href: "/admin/approvals", label: "Accesos y roles", icon: Shield },
  { href: "/profile", label: "Mi perfil", icon: FolderKanban },
  { href: "/finance", label: "Finanzas", icon: CreditCard }
];

const collaboratorItems = [
  { href: "/", label: "Mi portal", icon: LayoutGrid },
  { href: "/calendar", label: "Mi calendario", icon: Calendar },
  { href: "/requests", label: "Solicitudes", icon: ClipboardList },
  { href: "/profile", label: "Mi perfil", icon: FolderKanban }
];

export default function Sidebar({ role }: { role: Role }) {
  const items = role === "ADMIN" ? adminItems : collaboratorItems;

  return (
    <aside className="hidden w-64 flex-col gap-6 border-r border-slate-200 bg-white px-6 py-8 lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kimce-600 text-white">K</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Kimce Studio</p>
          <p className="text-xs text-slate-500">Portal interno</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-kimce-50 hover:text-kimce-700"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
        <p>Sesion iniciada</p>
        <p className="font-medium text-slate-700">Acceso seguro</p>
      </div>
      <Link
        href="/api/auth/signout"
        className="mt-auto flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Link>
    </aside>
  );
}
