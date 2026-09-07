const statuses = [
  { label: "Pending", value: 8, total: 20, color: "bg-amber-500" },
  { label: "Approved", value: 9, total: 20, color: "bg-emerald-600" },
  { label: "Returned", value: 3, total: 20, color: "bg-rose-600" },
];

export function RequestStatusChart() {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-brgy-navy">Request status</h2>
      <p className="mb-4 text-sm text-brgy-muted">How document requests stand this week</p>
      <ul className="space-y-4">
        {statuses.map((status) => (
          <li key={status.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{status.label}</span>
              <span className="text-brgy-muted">{status.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/8">
              <div
                className={`h-full rounded-full ${status.color}`}
                style={{ width: `${(status.value / status.total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
