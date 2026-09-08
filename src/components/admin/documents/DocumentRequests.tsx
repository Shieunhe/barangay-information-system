"use client";

import { useState } from "react";
import type { DocumentRequest, ProcessStatus, VerificationStatus } from "@/types/documentRequest";
import { RequestViewModal } from "./RequestViewModal";
import { Button } from "@/components/common/Button";
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
    <div className="px-4 py-6 text-brgy-ink lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">
          Document Requests
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-brgy-muted">
          Verify the request first. After the document is prepared, mark it done. When the resident claims it, mark it picked up.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Pending verification</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{pendingCount}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">In process</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{inProcessCount}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Ready for pickup</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{readyCount}</p>
        </article>
        <article className="rounded-xl border border-black/8 bg-white px-4 py-4 shadow-sm">
          <p className="text-sm text-brgy-muted">Picked up</p>
          <p className="mt-1 text-2xl font-semibold text-brgy-navy">{pickedUpCount}</p>
        </article>
      </div>

      <section className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-black/10 bg-brgy-paper/70 text-brgy-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Resident</th>
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">Process</th>
                <th className="px-4 py-3 font-medium">
                  <span className="mx-auto block w-[13.75rem] text-center">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const nextAction = getNextAction(request);

                return (
                  <tr key={request.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-xs text-brgy-muted">
                        {request.id} · {request.date}
                      </p>
                    </td>
                    <td className="px-4 py-3">{request.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${verificationClass[request.verification]}`}
                      >
                        {request.verification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${processClass[request.process]}`}
                      >
                        {request.process}
                      </span>
                    </td>
                    <td className="px-4 py-3">
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
                          <span className="inline-flex h-8 w-full items-center justify-center text-sm font-medium text-brgy-muted">
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

      {selected ? <RequestViewModal request={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
