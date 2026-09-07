export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-brgy-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-brgy-navy">{value}</p>
      <p className="mt-2 text-sm text-brgy-ink/80">{detail}</p>
    </article>
  );
}
