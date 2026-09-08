"use client";

import { X } from "lucide-react";

export interface RequestSummary {
  type: string;
  date: string;
  status: string;
}

interface RequestViewModalProps {
  request: RequestSummary | null;
  onClose: () => void;
}

export default function RequestViewModal({ request, onClose }: RequestViewModalProps) {
  if (!request) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-brgy-navy">Request details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-brgy-muted hover:text-brgy-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-brgy-muted">Document</dt>
            <dd className="font-medium">{request.type}</dd>
          </div>
          <div>
            <dt className="text-brgy-muted">Date requested</dt>
            <dd className="font-medium">{request.date}</dd>
          </div>
          <div>
            <dt className="text-brgy-muted">Status</dt>
            <dd className="font-medium">{request.status}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
