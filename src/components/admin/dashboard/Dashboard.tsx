import Link from "next/link";
import { auditTrailEntries } from "@/common/admin/auditTrailEntries";
import {
  initialDocumentRequests,
  pendingVerification,
  pickedUp,
  verified,
} from "@/common/admin/documentRequests";
import { formatEventDate, formatEventTime, getEventStatus } from "@/common/admin/eventSchedule";
import { initialEvents } from "@/common/admin/events";
import { initialResidents } from "@/common/admin/residents";
import { processLabel } from "@/common/statusStyles";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";

const statusDot: Record<string, string> = {
  "—": "bg-zinc-300",
  "In process": "bg-sky-400",
  Done: "bg-orange-400",
  "Picked up": "bg-emerald-400",
};

export function Dashboard() {
  const pendingRequests = initialDocumentRequests.filter(
    (request) => request.verification === pendingVerification,
  );
  const pendingDocuments = pendingRequests.length;
  const registeredResidents = initialResidents.filter((resident) => resident.status === "Registered").length;
  const upcomingEvents = initialEvents.filter((event) => getEventStatus(event.date) === "Upcoming");
  const approvedRequests = initialDocumentRequests.filter(
    (request) => request.verification === verified && request.process !== pickedUp,
  ).length;
  const pickedUpRequests = initialDocumentRequests.filter((request) => request.process === pickedUp).length;
  const recentActivity = auditTrailEntries.slice(0, 4);

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">Home <span className="mx-1">&gt;</span> Dashboard</p>
        <CurrentDateTime />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2c3e50]">Barangay Dashboard</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          View of work that needs attention: papers to verify, people to register, events to post, and a record of office
          actions.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pendingDocuments}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Pending documents</p>
          <p className="mt-1 text-sm text-neutral-400">Need verification today</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{registeredResidents}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Registered residents</p>
          <p className="mt-1 text-sm text-neutral-400">People listed in the barangay</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{upcomingEvents.length}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Upcoming events</p>
          <p className="mt-1 text-sm text-neutral-400">With assigned staff</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{auditTrailEntries.length}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Audit entries</p>
          <p className="mt-1 text-sm text-neutral-400">Recorded this week</p>
        </article>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2c3e50]">Document requests to verify</h2>
              <p className="mt-1 text-sm text-neutral-400">Check and approve papers submitted by residents</p>
            </div>
            <Link href="/admin/documents" className="shrink-0 text-sm text-neutral-400 hover:text-brgy-sidebar">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">DAS
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="py-3 pr-3 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">STATUS</th>
                  <th className="py-3 pr-3 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">NAME</th>
                  <th className="py-3 pr-3 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DOCUMENTS</th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DATE</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-neutral-400">
                      No pending documents to verify.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-3 pr-3">
                        <span className="inline-flex items-center gap-2 text-xs text-neutral-500">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusDot[request.process]}`} />
                          {processLabel[request.process]}
                        </span>
                      </td>
                      <td className="py-3 pr-3">{request.name}</td>
                      <td className="py-3 pr-3">{request.type}</td>
                      <td className="py-3 text-neutral-500">{request.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2c3e50]">Upcoming events</h2>
              <p className="mt-1 text-sm text-neutral-400">Posted activities with assigned staff</p>
            </div>
            <Link href="/admin/events" className="shrink-0 text-sm text-neutral-400 hover:text-brgy-sidebar">
              View all events
            </Link>
          </div>
          <ul>
            {upcomingEvents.length === 0 ? (
              <li className="py-8 text-center text-sm text-neutral-400">No upcoming event.</li>
            ) : (
              upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-brgy-ink">{event.title}</p>
                    <p className="mt-1 text-sm text-neutral-400">Assigned to {event.assignee}</p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-400">
                    {formatEventDate(event.date)}, {formatEventTime(event.time)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2c3e50]">Recent office activity</h2>
              <p className="mt-1 text-sm text-neutral-400">Latest entries from the audit trail</p>
            </div>
            <Link href="/admin/audit-trail" className="shrink-0 text-sm text-neutral-400 hover:text-brgy-sidebar">
              View all trails
            </Link>
          </div>
          <ul>
            {recentActivity.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-brgy-ink">{entry.action}</p>
                  <p className="mt-1 text-sm text-neutral-400">{entry.staff}</p>
                </div>
                <p className="shrink-0 text-sm text-neutral-400">
                  {entry.date}, {entry.time}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-6">
            <h2 className="text-base font-bold text-[#2c3e50]">Request status</h2>
            <p className="mt-1 text-sm text-neutral-400">How document requests stand this week</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pendingDocuments}</p>
              <p className="mt-2 text-sm font-semibold text-black">Pending</p>
            </div>
            <div>
              <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{approvedRequests}</p>
              <p className="mt-2 text-sm font-semibold text-black">Approved</p>
            </div>
            <div>
              <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pickedUpRequests}</p>
              <p className="mt-2 text-sm font-semibold text-black">Picked up</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
