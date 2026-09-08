export function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <article className="rounded-xl bg-white px-5 py-4 shadow-sm">
      <p className="text-4xl font-semibold text-[#c4a35a]">{value}</p>
      <p className="mt-1 font-semibold text-brgy-ink">{label}</p>
    </article>
  );
}
