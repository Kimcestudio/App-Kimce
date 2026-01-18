export default function FinancePage() {
  return (
    <div className="space-y-8">
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Finanzas</h2>
        <p className="mt-1 text-sm text-slate-500">Planilla mensual con base y variables por horas extra.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="pill-button pill-secondary">Exportar CSV</button>
          <button className="pill-button pill-primary">Cerrar ciclo</button>
        </div>
      </div>
      <div className="card p-8">
        <h3 className="section-title">Planilla de julio 2024</h3>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2">Colaborador</th>
                <th>Base</th>
                <th>Variable</th>
                <th>Bonos</th>
                <th>Descuentos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Luis Gómez", total: "S/ 3,200", status: "PENDING" },
                { name: "Ana Pérez", total: "S/ 5,400", status: "PAID" }
              ].map((row) => (
                <tr key={row.name} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-700">{row.name}</td>
                  <td>S/ 2,800</td>
                  <td>S/ 200</td>
                  <td>S/ 300</td>
                  <td>S/ 100</td>
                  <td className="font-semibold text-slate-900">{row.total}</td>
                  <td>
                    <span className={`badge ${row.status === "PAID" ? "badge-success" : "badge-warning"}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
