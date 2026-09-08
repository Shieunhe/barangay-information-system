import { auditTrailEntries } from "@/common/admin/auditTrailEntries";
import type { AuditModule } from "@/types/auditTrail";

const moduleClass: Record<AuditModule, string> = {
  Documents: "bg-sky-100 text-sky-800",
  Events: "bg-brgy-gold/20 text-brgy-navy",
  Residents: "bg-emerald-100 text-emerald-800",
  System: "bg-zinc-100 text-zinc-600",
};

export function AuditTrail() {
  const documentActions = auditTrailEntries.filter((entry) => entry.module === "Documents").length;
  const eventActions = auditTrailEntries.filter((entry) => entry.module === "Events").length;
  const residentActions = auditTrailEntries.filter((entry) => entry.module === "Residents").length;

  return (
    <div className="px-4 py-6 text-brgy-ink lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">
          Audit Trail
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-brgy-muted">
          A record of office actions: document reviews, event posts, and changes to resident records.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">All entries</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{auditTrailEntries.length}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Document actions</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{documentActions}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Event posts</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{eventActions}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Resident records</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{residentActions}</p>
        </article>
      </div>

      <section className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 bg-brgy-paper/70 text-brgy-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date and time</th>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditTrailEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brgy-navy">{entry.date}</p>
                    <p className="text-xs text-brgy-muted">{entry.time}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.staff}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${moduleClass[entry.module]}`}>
                      {entry.module}
                    </span>
                  </td>
                  <td className="px-4 py-3">{entry.action}</td>
                  <td className="px-4 py-3 text-brgy-muted">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
