"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, FileText } from "lucide-react";
import RequestViewModal, { type RequestSummary } from "@/components/user/RequestViewModal";

const requests: RequestSummary[] = [
  { type: "Barangay Clearance", date: "Sept 6, 2026", status: "Pending" },
  { type: "Certificate of Residency", date: "Sept 3, 2026", status: "Approved" },
  { type: "Certificate of Indigency", date: "Aug 28, 2026", status: "Ready for pickup" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  "Ready for pickup": "bg-sky-100 text-sky-800",
};

export default function ViewRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<RequestSummary | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">
            My Requests
          </h1>
          <p className="mt-2 max-w-2xl text-base text-brgy-muted">
            Track the documents you have requested from the barangay.
          </p>
        </div>
        <Link
          href="/user/documents/request"
          className="inline-flex items-center gap-2 rounded-lg bg-brgy-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brgy-navy-mid"
        >
          <FileText className="h-4 w-4" />
          New request
        </Link>
      </div>

      <section className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-black/10 text-brgy-muted">
              <tr>
                <th className="py-2 font-medium">View</th>
                <th className="py-2 font-medium">Document</th>
                <th className="py-2 font-medium">Date requested</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={`${request.type}-${request.date}`} className="border-b border-black/5 last:border-0">
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(request)}
                      aria-label={`View ${request.type} request`}
                      className="rounded-md p-1.5 text-brgy-navy hover:bg-brgy-navy/10"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="py-3 font-medium">{request.type}</td>
                  <td className="py-3 text-brgy-muted">{request.date}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RequestViewModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
    </div>
  );
}
