"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { actionLogsQueryKey, getActionLogs } from "@/services/actionLogs";
import type { AuditModule } from "@/types/auditTrail";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";
import { TablePagination } from "@/components/common/TablePagination";

const moduleClass: Record<AuditModule, string> = {
  Documents: "bg-sky-100 text-sky-800",
  Events: "bg-brgy-gold/20 text-brgy-navy",
  Residents: "bg-emerald-100 text-emerald-800",
  System: "bg-zinc-100 text-zinc-600",
};

const pageSize = 10;

export function AuditTrail() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const logsQuery = useQuery({
    queryKey: actionLogsQueryKey,
    queryFn: getActionLogs,
    staleTime: 0,
    refetchOnMount: true,
  });

  const entries = logsQuery.data ?? [];
  const documentActions = entries.filter((entry) => entry.module === "Documents").length;
  const eventActions = entries.filter((entry) => entry.module === "Events").length;
  const residentActions = entries.filter((entry) => entry.module === "Residents").length;
  const search = query.trim().toLowerCase();
  const visibleEntries = entries.filter((entry) => {
    if (!search) {
      return true;
    }

    return [entry.id, entry.date, entry.time, entry.staff, entry.module, entry.action, entry.details, entry.residentName]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
  const pageCount = Math.max(1, Math.ceil(visibleEntries.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedEntries = visibleEntries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          <Link href="/admin/dashboard" className="hover:text-brgy-sidebar">
            Dashboard
          </Link>
          <span className="mx-1">&gt;</span> Audit Trail
        </p>
        <CurrentDateTime />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2c3e50]">Audit Trail</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          A record of office actions: document reviews, event posts, and changes to resident records.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{entries.length}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">All Entries</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{documentActions}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Document Actions</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{eventActions}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Event Posts</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{residentActions}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Resident Records</p>
        </article>
      </div>

      <label className="mb-4 flex items-center gap-3 rounded-[10px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search staff, resident, action, or details"
          className="w-full bg-transparent text-sm text-brgy-ink outline-none placeholder:text-neutral-400"
        />
      </label>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-white">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DATE AND TIME</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">STAFF</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">RESIDENT</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">MODULE</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">ACTION</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {logsQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-neutral-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logsQuery.error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-red-600">
                    {logsQuery.error instanceof Error ? logsQuery.error.message : "Could not load action logs."}
                  </td>
                </tr>
              ) : visibleEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No matching entries.
                  </td>
                </tr>
              ) : (
                pagedEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-neutral-200 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium">{entry.date}</p>
                      <p className="text-xs text-neutral-500">{entry.time}</p>
                    </td>
                    <td className="px-5 py-4">{entry.staff}</td>
                    <td className="px-5 py-4">{entry.residentName || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${moduleClass[entry.module]}`}>
                        {entry.module}
                      </span>
                    </td>
                    <td className="px-5 py-4">{entry.action}</td>
                    <td className="px-5 py-4 text-neutral-600">{entry.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </section>
    </div>
  );
}
