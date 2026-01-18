"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/"
    });

    if (response?.error) {
      setError("Credenciales inválidas. Consulta con el administrador.");
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-soft">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Acceso Kimce</h1>
        <p className="mt-1 text-sm text-slate-500">Ingresa con tu correo corporativo.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo</label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-kimce-500 focus:outline-none"
            type="email"
            placeholder="ana@kimce.studio"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contraseña</label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-kimce-500 focus:outline-none"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        <button className="w-full rounded-full bg-kimce-600 px-4 py-3 text-sm font-semibold text-white">
          Ingresar
        </button>
      </form>
      <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
        <p>Usuarios demo:</p>
        <p>admin@kimce.studio</p>
        <p>luis@kimce.studio</p>
      </div>
    </div>
  );
}
