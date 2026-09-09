"use client";

import { useState } from "react";
import { declineReasons } from "@/common/admin/declineReasons";
import { residentStatusClass } from "@/common/statusStyles";
import { Button } from "@/components/common/Button";
import type { Resident, ResidentStatus } from "@/types/resident";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">{label}</p>
      <p className="mt-1 border-b border-neutral-300 pb-1 text-sm text-brgy-ink">{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-neutral-200" />
      <h3 className="text-sm font-semibold text-brgy-ink">{children}</h3>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

export function ResidentViewModal({
  resident,
  loading,
  onClose,
  onDecide,
}: {
  resident: Resident;
  loading: boolean;
  onClose: () => void;
  onDecide: (status: ResidentStatus, declineReason: string | null) => void;
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");
  const [action, setAction] = useState<"register" | "decline" | null>(null);
  const isPending = resident.status === "Pending";

  function resolveDeclineReason() {
    if (!selectedReason) {
      return "";
    }

    if (selectedReason === "Other") {
      return otherReason.trim();
    }

    return selectedReason;
  }

  function handleDecline() {
    const reason = resolveDeclineReason();

    if (!reason) {
      setError("Select a reason, or type one if you choose Other.");
      return;
    }

    setError("");
    setAction("decline");
    onDecide("Not registered", reason);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close resident details"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="bg-brgy-sidebar px-5 py-4 text-white">
          <p className="text-sm text-white/80">Resident registration</p>
          <h2 className="mt-1 text-2xl font-semibold">{resident.id}</h2>
          <p className="mt-2 text-sm text-white/80">
            Check the National ID and details to confirm this person is eligible for this barangay.
          </p>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section>
            <SectionTitle>Submitted IDs</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-lg border border-[#c5d4f0] bg-[#f4f7fb]">
                <img src={resident.nationalIdFront} alt="National ID front" className="h-44 w-full object-cover" />
                <figcaption className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brgy-sidebar">
                  National ID — Front
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-lg border border-[#c5d4f0] bg-[#f4f7fb]">
                <img src={resident.nationalIdBack} alt="National ID back" className="h-44 w-full object-cover" />
                <figcaption className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brgy-sidebar">
                  National ID — Back
                </figcaption>
              </figure>
            </div>
          </section>

          <section>
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Full name" value={resident.name} />
              <InfoField label="Age" value={`${resident.age} years old`} />
              <InfoField label="Sex" value={resident.sex} />
              <InfoField label="Civil status" value={resident.civilStatus} />
              <InfoField label="Date of birth" value={resident.birthDate} />
              <InfoField label="Contact number" value={resident.contact} />
              <div className="sm:col-span-2">
                <InfoField label="Address" value={resident.address} />
              </div>
              <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">Status</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                  {resident.status}
                </span>
              </div>
              <InfoField label="Date filed" value={resident.dateFiled} />
            </div>
          </section>

          {resident.status === "Not registered" && resident.declineReason ? (
            <section>
              <SectionTitle>Decline reason</SectionTitle>
              <p className="rounded-lg border border-[#c5d4f0] px-3 py-2.5 text-sm text-brgy-ink">{resident.declineReason}</p>
            </section>
          ) : null}

          {isPending ? (
            <section>
              <SectionTitle>Decline reason</SectionTitle>
              <label className="mb-3 block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
                  Why decline
                </span>
                <select
                  value={selectedReason}
                  onChange={(event) => {
                    setSelectedReason(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
                >
                  <option value="">Select a reason</option>
                  {declineReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </label>
              {selectedReason === "Other" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
                    Type the reason
                  </span>
                  <textarea
                    value={otherReason}
                    onChange={(event) => {
                      setOtherReason(event.target.value);
                      setError("");
                    }}
                    rows={3}
                    placeholder="Write why this person is not eligible"
                    className="w-full rounded-lg border border-[#c5d4f0] px-3 py-2.5 text-sm text-brgy-ink outline-none"
                  />
                </label>
              ) : null}
              {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            </section>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isPending ? (
              <>
                <Button
                  size="md"
                  loading={loading && action === "register"}
                  disabled={loading}
                  onClick={() => {
                    setAction("register");
                    onDecide("Registered", null);
                  }}
                >
                  Register
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  loading={loading && action === "decline"}
                  disabled={loading}
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </>
            ) : null}
            <Button size="md" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
