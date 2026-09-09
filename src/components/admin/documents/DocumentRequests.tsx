"use client";

import { useState } from "react";
import Link from "next/link";
import type { DocumentRequest, ProcessStatus, VerificationStatus } from "@/types/documentRequest";
import { RequestViewModal } from "./RequestViewModal";
import { Button } from "@/components/common/Button";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";
import { processClass, processLabel, verificationClass } from "@/common/statusStyles";

const pendingVerification = "Pending" satisfies VerificationStatus;
const verified = "Verified" satisfies VerificationStatus;
const notStarted = "—" satisfies ProcessStatus;
const inProcess = "In process" satisfies ProcessStatus;
const done = "Done" satisfies ProcessStatus;
const pickedUp = "Picked up" satisfies ProcessStatus;

const initialRequests: DocumentRequest[] = [
  {
    id: "DR-001",
    name: "Maria Santos",
    type: "Barangay Clearance",
    date: "Sept. 7, 2026",
    verification: pendingVerification,
    process: notStarted,
    purpose: "Employment requirement",
    age: 28,
    sex: "Female",
    civilStatus: "Single",
    birthDate: "March 12, 1998",
    address: "Purok 2, Sitio Maligaya",
    contact: "0917 555 2101",
  },
  {
    id: "DR-002",
    name: "Jose Ramirez",
    type: "Certificate of Residency",
    date: "Sept. 6, 2026",
    verification: verified,
    process: inProcess,
    purpose: "School enrollment",
    age: 19,
    sex: "Male",
    civilStatus: "Single",
    birthDate: "July 3, 2007",
    address: "Purok 4, Riverside",
    contact: "0918 442 1188",
  },
  {
    id: "DR-003",
    name: "Ana Villanueva",
    type: "Indigency Certificate",
    date: "Sept. 6, 2026",
    verification: pendingVerification,
    process: notStarted,
    purpose: "Medical assistance",
    age: 41,
    sex: "Female",
    civilStatus: "Married",
    birthDate: "November 21, 1984",
    address: "Purok 1, Centro",
    contact: "0922 300 7745",
  },
  {
    id: "DR-004",
    name: "Carlo Mendoza",
    type: "Barangay Clearance",
    date: "Sept. 5, 2026",
    verification: verified,
    process: done,
    purpose: "Local business permit",
    age: 35,
    sex: "Male",
    civilStatus: "Married",
    birthDate: "January 8, 1991",
    address: "Purok 5, San Isidro",
    contact: "0916 889 3340",
  },
  {
    id: "DR-005",
    name: "Liza Navarro",
    type: "Certificate of Indigency",
    date: "Sept. 4, 2026",
    verification: verified,
    process: pickedUp,
    purpose: "Scholarship application",
    age: 22,
    sex: "Female",
    civilStatus: "Single",
    birthDate: "May 16, 2004",
    address: "Purok 3, Hillside",
    contact: "0908 221 6672",
  },
];

function getNextAction(request: DocumentRequest) {
  if (request.verification === pendingVerification) {
    return "Verify";
  }

  if (request.verification === verified && request.process === inProcess) {
    return "Mark as done";
  }

  if (request.process === done) {
    return "Picked up";
  }

  return null;
}

function applyNextStep(request: DocumentRequest): DocumentRequest {
  if (request.verification === pendingVerification) {
    return { ...request, verification: verified, process: inProcess };
  }

  if (request.verification === verified && request.process === inProcess) {
    return { ...request, process: done };
  }

  if (request.process === done) {
    return { ...request, process: pickedUp };
  }

  return request;
}

export function DocumentRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [selected, setSelected] = useState<DocumentRequest | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const pendingCount = requests.filter((request) => request.verification === pendingVerification).length;
  const inProcessCount = requests.filter((request) => request.process === inProcess).length;
  const readyCount = requests.filter((request) => request.process === done).length;
  const pickedUpCount = requests.filter((request) => request.process === pickedUp).length;
  const search = query.trim().toLowerCase();
  const visibleRequests = requests.filter((request) => {
    if (!search) {
      return true;
    }

    return [
      request.name,
      request.type,
      request.date,
      request.id,
      request.verification,
      processLabel[request.process],
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  function handleNextAction() {
    if (!selected || loading) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const updated = applyNextStep(selected);
      setRequests((current) =>
        current.map((request) => (request.id === updated.id ? updated : request)),
      );
      setSelected(updated);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          <Link href="/admin/dashboard" className="hover:text-brgy-sidebar">
            Dashboard
          </Link>
          <span className="mx-1">&gt;</span> Document Requests
        </p>
        <CurrentDateTime />
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2c3e50]">Document Requests</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          Review papers requested by residents, such as clearances and certificates, then approve or return them.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pendingCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Pending Verification</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{inProcessCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">In Process</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{readyCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Ready to pickup</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pickedUpCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Approved / Picked up</p>
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
          placeholder="Search name, document, status, or date"
          className="w-full bg-transparent text-sm text-brgy-ink outline-none placeholder:text-neutral-400"
        />
      </label>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-white">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">REQUEST ID</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">VERIFICATION</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">NAME</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DOCUMENTS</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DATE FILED</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">STATUS</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No matching requests.
                  </td>
                </tr>
              ) : null}
              {visibleRequests.map((request) => (
                <tr key={request.id} className="border-b border-neutral-200 last:border-0">
                  <td className="px-5 py-4 font-medium">{request.id}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${verificationClass[request.verification]}`}
                    >
                      {request.verification}
                    </span>
                  </td>
                  <td className="px-5 py-4">{request.name}</td>
                  <td className="px-5 py-4">{request.type}</td>
                  <td className="px-5 py-4">{request.date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${processClass[request.process]}`}
                    >
                      {processLabel[request.process]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      variant={
                        request.verification === verified && request.process === pickedUp
                          ? "secondary"
                          : "primary"
                      }
                      onClick={() => setSelected(request)}
                    >
                      View Request
                    </Button>
                  </td>
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

      {selected ? (
        <RequestViewModal
          request={selected}
          nextAction={getNextAction(selected)}
          loading={loading}
          onClose={() => {
            setLoading(false);
            setSelected(null);
          }}
          onNextAction={handleNextAction}
        />
      ) : null}
    </div>
  );
}
