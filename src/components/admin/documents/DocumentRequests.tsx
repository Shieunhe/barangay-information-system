"use client";

import { useState } from "react";
import type { DocumentRequest, ProcessStatus, VerificationStatus } from "@/types/documentRequest";
import { RequestViewModal } from "./RequestViewModal";
import { Button } from "@/components/common/Button";
import { StatCard } from "@/components/common/StatCard";
import { processClass, verificationClass } from "@/common/statusStyles";

const pendingVerification = "Pending" satisfies VerificationStatus;
const verified = "Verified" satisfies VerificationStatus;
const notStarted = "—" satisfies ProcessStatus;
const inProcess = "In process" satisfies ProcessStatus;
const done = "Done" satisfies ProcessStatus;
const pickedUp = "Picked up" satisfies ProcessStatus;

const requests: DocumentRequest[] = [
  {
    id: "DR-001",
    name: "Maria Santos",
    type: "Barangay Clearance",
    date: "Sept 7, 2026",
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
    date: "Sept 6, 2026",
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
    date: "Sept 6, 2026",
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
    date: "Sept 5, 2026",
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
    date: "Sept 4, 2026",
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

export function DocumentRequests() {
  const [selected, setSelected] = useState<DocumentRequest | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleAction(requestId: string) {
    if (loadingId) {
      return;
    }

    setLoadingId(requestId);
    window.setTimeout(() => {
      setLoadingId(null);
    }, 800);
  }

  const pendingCount = requests.filter((request) => request.verification === pendingVerification).length;
  const inProcessCount = requests.filter((request) => request.process === inProcess).length;
  const readyCount = requests.filter((request) => request.process === done).length;
  const pickedUpCount = requests.filter((request) => request.process === pickedUp).length;

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <p className="mb-4 text-sm text-neutral-400">
        Home <span className="mx-1">&gt;</span> Document Requests
      </p>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a4d8c]">Document Requests</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          Review papers requested by residents, such as clearances and certificates, then approve or return them.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard value={pendingCount} label="Pending Verification" />
        <StatCard value={inProcessCount} label="In Process" />
        <StatCard value={readyCount} label="Ready to pickup" />
        <StatCard value={pickedUpCount} label="Approved / Picked up" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-5 py-4 text-xs font-bold tracking-wide text-brgy-ink">RESIDENT</th>
                <th className="px-5 py-4 text-xs font-bold tracking-wide text-brgy-ink">DOCUMENT</th>
                <th className="px-5 py-4 text-xs font-bold tracking-wide text-brgy-ink">VERIFICATION</th>
                <th className="px-5 py-4 text-xs font-bold tracking-wide text-brgy-ink">PROCESS</th>
                <th className="px-5 py-4 text-xs font-bold tracking-wide text-brgy-ink">
                  <span className="mx-auto block w-[13.75rem] text-center">ACTION</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const nextAction = getNextAction(request);

                return (
                  <tr key={request.id} className="border-b border-neutral-200 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-xs text-neutral-500">
                        {request.id} · {request.date}
                      </p>
                    </td>
                    <td className="px-5 py-4">{request.type}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${verificationClass[request.verification]}`}
                      >
                        {request.verification}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${processClass[request.process]}`}
                      >
                        {request.process}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="mx-auto grid w-[13.75rem] grid-cols-[5.25rem_1fr] items-center gap-2">
                        <Button variant="secondary" onClick={() => setSelected(request)}>
                          View
                        </Button>
                        {nextAction ? (
                          <Button
                            className="w-full"
                            loading={loadingId === request.id}
                            onClick={() => handleAction(request.id)}
                          >
                            {nextAction}
                          </Button>
                        ) : (
                          <span className="inline-flex h-8 w-full items-center justify-center text-sm font-medium text-neutral-400">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-center gap-3 pt-6">
        {[1, 2, 3, 4, 5].map((page) => (
          <span
            key={page}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
              page === 1 ? "bg-[#1a4d8c] font-medium text-white" : "text-brgy-ink"
            }`}
          >
            {page}
          </span>
        ))}
      </div>

      {selected ? <RequestViewModal request={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
