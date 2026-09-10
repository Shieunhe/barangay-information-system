"use client";

import { useState } from "react";
import Link from "next/link";
import { auditTrailEntries } from "@/common/admin/auditTrailEntries";
import type { AuditModule } from "@/types/auditTrail";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";

const moduleClass: Record<AuditModule, string> = {
  Documents: "bg-sky-100 text-sky-800",
  Events: "bg-brgy-gold/20 text-brgy-navy",
  Residents: "bg-emerald-100 text-emerald-800",
  System: "bg-zinc-100 text-zinc-600",
};

export function AuditTrail() {
  const [query, setQuery] = useState("");
  const documentActions = auditTrailEntries.filter((entry) => entry.module === "Documents").length;
  const eventActions = auditTrailEntries.filter((entry) => entry.module === "Events").length;
  const residentActions = auditTrailEntries.filter((entry) => entry.module === "Residents").length;
  const search = query.trim().toLowerCase();
  const visibleEntries = auditTrailEntries.filter((entry) => {
    if (!search) {
      return true;
    }

    return [entry.id, entry.date, entry.time, entry.staff, entry.module, entry.action, entry.details]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

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
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{auditTrailEntries.length}</p>
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
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search staff, module, action, or details"
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
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">MODULE</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">ACTION</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {visibleEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No matching entries.
                  </td>
                </tr>
              ) : null}
              {visibleEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-neutral-200 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium">{entry.date}</p>
                    <p className="text-xs text-neutral-500">{entry.time}</p>
                  </td>
                  <td className="px-5 py-4">{entry.staff}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${moduleClass[entry.module]}`}>
                      {entry.module}
                    </span>
                  </td>
                  <td className="px-5 py-4">{entry.action}</td>
                  <td className="px-5 py-4 text-neutral-600">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-3 px-4 py-5">
          {[1, 2, 3, 4, 5].map((page) => (
            <span
              key={page}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                page === 1 ? "bg-brgy-sidebar font-medium text-white" : "text-brgy-ink"
              }`}
            >
              {page}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
