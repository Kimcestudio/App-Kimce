import "../globals.css";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
          <Sidebar role={session?.user?.role ?? "COLLABORATOR"} />
          <div className="flex flex-1 flex-col">
            <Header user={session?.user} />
            <main className="flex-1 px-10 pb-12 pt-8">
              <div className="mx-auto max-w-6xl space-y-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
