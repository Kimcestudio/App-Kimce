import { Bell, Moon, Search } from "lucide-react";
import type { Session } from "next-auth";

export default function Header({ user }: { user?: Session["user"] }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="text-xs text-slate-500">Portal Kimce Studio</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 lg:flex">
          <Search className="h-4 w-4" />
          Buscar colaborador, solicitud o evento…
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Moon className="h-4 w-4" />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-kimce-50 text-kimce-600">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kimce-200 text-sm font-semibold text-kimce-900">
            {user?.name?.charAt(0) ?? "K"}
          </div>
          <div className="hidden text-sm lg:block">
            <p className="font-semibold text-slate-900">{user?.name ?? "Equipo"}</p>
            <p className="text-xs text-slate-500">{user?.role ?? "COLLABORATOR"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
