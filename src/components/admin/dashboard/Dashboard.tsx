"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { actionLogsQueryKey, getActionLogs } from "@/services/actionLogs";
import { getResidentUsers, residentUsersQueryKey } from "@/services/users";
import { residentStatusClass } from "@/common/statusStyles";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";
import { formatResidentFullName } from "@/types/resident";

const pendingLimit = 3;

export function Dashboard() {
  const residentsQuery = useQuery({
    queryKey: residentUsersQueryKey,
    queryFn: getResidentUsers,
  });
  const logsQuery = useQuery({
    queryKey: actionLogsQueryKey,
    queryFn: getActionLogs,
    staleTime: 0,
    refetchOnMount: true,
  });

  const residents = residentsQuery.data ?? [];
  const registeredResidents = residents.filter((resident) => resident.status === "Registered").length;
  const recentActivity = (logsQuery.data ?? []).slice(0, 4);
  const latestPendingResidents = residents
    .filter((resident) => resident.status === "Pending")
    .sort((left, right) => {
      const byDate = right.dateFiled.localeCompare(left.dateFiled);
      return byDate !== 0 ? byDate : right.id - left.id;
    })
    .slice(0, pendingLimit);

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
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">0</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Pending documents</p>
          <p className="mt-1 text-sm text-neutral-400">Need verification today</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">
            {residentsQuery.isLoading ? "—" : registeredResidents}
          </p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Registered residents</p>
          <p className="mt-1 text-sm text-neutral-400">People listed in the barangay</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">0</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Upcoming events</p>
          <p className="mt-1 text-sm text-neutral-400">With assigned staff</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">
            {logsQuery.isLoading ? "—" : (logsQuery.data ?? []).length}
          </p>
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
          <div className="overflow-x-auto">
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
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-neutral-400">
                    No pending documents to verify.
                  </td>
                </tr>
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
          <p className="py-8 text-center text-sm text-neutral-400">No upcoming event.</p>
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
          {logsQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-neutral-400">Loading activity...</p>
          ) : logsQuery.error ? (
            <p className="py-8 text-center text-sm text-red-600">Could not load action logs.</p>
          ) : recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No recent activity.</p>
          ) : (
            <ul>
              {recentActivity.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-brgy-ink">{entry.action}</p>
                    <p className="mt-1 text-sm text-neutral-400">{entry.residentName || entry.staff}</p>
                  </div>
                  <p className="shrink-0 text-sm text-neutral-400">
                    {entry.date}, {entry.time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2c3e50]">Pending residents</h2>
              <p className="mt-1 text-sm text-neutral-400">Latest people waiting to be registered</p>
            </div>
            <Link href="/admin/residents" className="shrink-0 text-sm text-neutral-400 hover:text-brgy-sidebar">
              View all
            </Link>
          </div>
          {residentsQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-neutral-400">Loading residents...</p>
          ) : residentsQuery.error ? (
            <p className="py-8 text-center text-sm text-red-600">Could not load residents from Firestore.</p>
          ) : latestPendingResidents.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No pending residents.</p>
          ) : (
            <ul>
              {latestPendingResidents.map((resident) => (
                <li key={resident.userId} className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-brgy-ink">{formatResidentFullName(resident)}</p>
                    <p className="mt-1 text-sm text-neutral-400">{[resident.address, resident.purok].filter(Boolean).join(", ")}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                      {resident.status}
                    </span>
                    <p className="mt-2 text-sm text-neutral-400">{resident.dateFiled}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
