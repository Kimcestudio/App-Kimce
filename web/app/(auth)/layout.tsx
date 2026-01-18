import "../globals.css";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100">
        <main className="flex min-h-screen items-center justify-center p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
