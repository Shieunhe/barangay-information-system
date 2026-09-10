"use client";

import { useEffect, useState } from "react";
import { declineReasons } from "@/common/admin/declineReasons";
import { organizations } from "@/common/admin/organizations";
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

const sexes = ["Male", "Female"] as const;
const civilStatuses = ["Single", "Married", "Widowed", "Separated"] as const;

function TextField({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 text-sm text-brgy-ink outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-[#c5d4f0] bg-white px-3 py-2.5 pr-10 text-sm text-brgy-ink outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-brgy-sidebar"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </span>
    </label>
  );
}

export function ResidentViewModal({
  resident,
  loading,
  onClose,
  onDecide,
  onUpdate,
}: {
  resident: Resident;
  loading: boolean;
  onClose: () => void;
  onDecide: (status: ResidentStatus, declineReason: string | null, organization: string | null) => void;
  onUpdate: (resident: Resident) => void;
}) {
  const [organization, setOrganization] = useState(resident.organization ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(resident);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");
  const [action, setAction] = useState<"register" | "decline" | "update" | null>(null);
  const isPending = resident.status === "Pending";
  const isRegistered = resident.status === "Registered";

  function updateDraft<K extends keyof Resident>(key: K, value: Resident[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function resolveDeclineReason() {
    if (!selectedReason) {
      return "";
    }

    if (selectedReason === "Other") {
      return otherReason.trim();
    }

    return selectedReason;
  }

  function handleRegister() {
    if (!organization) {
      setError("Select an organization. Choose None if the resident has no group.");
      return;
    }

    setError("");
    setAction("register");
    onDecide("Registered", null, organization);
  }

  function openDeclineModal() {
    setError("");
    setShowDeclineModal(true);
  }

  function closeDeclineModal() {
    if (loading) {
      return;
    }

    setShowDeclineModal(false);
    setSelectedReason("");
    setOtherReason("");
    setError("");
  }

  function startEditing() {
    setDraft(resident);
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    if (loading) {
      return;
    }

    setDraft(resident);
    setError("");
    setEditing(false);
  }

  function handleUpdate() {
    const name = draft.name.trim();
    const address = draft.address.trim();
    const contact = draft.contact.trim();
    const birthDate = draft.birthDate.trim();
    const age = Number(draft.age);

    if (!name || !address || !contact || !birthDate || !draft.sex || !draft.civilStatus) {
      setError("Fill in all resident details.");
      return;
    }

    if (!Number.isInteger(age) || age < 1) {
      setError("Enter a valid age.");
      return;
    }

    if (!draft.organization) {
      setError("Select an organization. Choose None if the resident has no group.");
      return;
    }

    setError("");
    setAction("update");
    onUpdate({
      ...resident,
      name,
      age,
      sex: draft.sex,
      civilStatus: draft.civilStatus,
      birthDate,
      address,
      contact,
      organization: draft.organization,
    });
  }

  useEffect(() => {
    if (action === "update" && !loading) {
      setEditing(false);
      setDraft(resident);
      setAction(null);
    }
  }, [action, loading, resident]);

  function confirmDecline() {
    const reason = resolveDeclineReason();

    if (!reason) {
      setError("Select a decline reason, or type one if you choose Other.");
      return;
    }

    setError("");
    setAction("decline");
    onDecide("Not registered", reason, null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close resident details"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="bg-brgy-sidebar px-5 py-4 text-white">
          <p className="text-sm text-white/80">Resident registration</p>
          <h2 className="mt-1 text-2xl font-semibold">{resident.id}</h2>
          <p className="mt-2 text-sm text-white/80">
            {isRegistered
              ? "Review or update this resident’s details."
              : "Review the details to confirm this person is eligible for this barangay."}
          </p>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section>
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {editing ? (
                <>
                  <TextField label="Full name" value={draft.name} onChange={(value) => updateDraft("name", value)} />
                  <TextField
                    label="Age"
                    type="number"
                    value={String(draft.age)}
                    onChange={(value) => updateDraft("age", Number(value) || 0)}
                  />
                  <SelectField
                    label="Sex"
                    value={draft.sex}
                    placeholder="Select sex"
                    options={sexes}
                    onChange={(value) => updateDraft("sex", value)}
                  />
                  <SelectField
                    label="Civil status"
                    value={draft.civilStatus}
                    placeholder="Select civil status"
                    options={civilStatuses}
                    onChange={(value) => updateDraft("civilStatus", value)}
                  />
                  <TextField
                    label="Date of birth"
                    value={draft.birthDate}
                    onChange={(value) => updateDraft("birthDate", value)}
                  />
                  <TextField
                    label="Contact number"
                    value={draft.contact}
                    onChange={(value) => updateDraft("contact", value)}
                  />
                  <div className="sm:col-span-2">
                    <TextField label="Address" value={draft.address} onChange={(value) => updateDraft("address", value)} />
                  </div>
                  <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                      {resident.status}
                    </span>
                  </div>
                  <InfoField label="Date filed" value={resident.dateFiled} />
                  <div className="sm:col-span-2">
                    <SelectField
                      label="Organization"
                      value={draft.organization ?? ""}
                      placeholder="Select organization"
                      options={organizations}
                      onChange={(value) => updateDraft("organization", value)}
                    />
                  </div>
                </>
              ) : (
                <>
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
                  {!isPending && resident.organization ? (
                    <div className="sm:col-span-2">
                      <InfoField label="Organization" value={resident.organization} />
                    </div>
                  ) : null}
                </>
              )}
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
              <SectionTitle>Organization</SectionTitle>
              <SelectField
                label="Organization"
                value={organization}
                placeholder="Select organization"
                options={organizations}
                onChange={(value) => {
                  setOrganization(value);
                  setError("");
                }}
              />
              {error && !showDeclineModal && !editing ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            </section>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {editing && error ? <p className="w-full text-center text-sm text-red-600">{error}</p> : null}
            {isPending ? (
              <>
                <Button
                  size="md"
                  loading={loading && action === "register"}
                  disabled={loading}
                  onClick={handleRegister}
                >
                  Register
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  disabled={loading}
                  onClick={openDeclineModal}
                >
                  Decline
                </Button>
              </>
            ) : null}
            {isRegistered && !editing ? (
              <Button size="md" disabled={loading} onClick={startEditing}>
                Update
              </Button>
            ) : null}
            {isRegistered && editing ? (
              <>
                <Button size="md" loading={loading && action === "update"} disabled={loading} onClick={handleUpdate}>
                  Save
                </Button>
                <Button size="md" variant="secondary" disabled={loading} onClick={cancelEditing}>
                  Cancel
                </Button>
              </>
            ) : null}
            <Button size="md" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {showDeclineModal ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close decline reason"
            className="absolute inset-0 bg-black/40"
            onClick={closeDeclineModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="bg-brgy-sidebar px-5 py-4 text-white">
              <p className="text-sm text-white/80">Decline registration</p>
              <h3 className="mt-1 text-xl font-semibold">{resident.id}</h3>
            </div>
            <div className="space-y-4 px-5 py-5">
              <SelectField
                label="Decline reason"
                value={selectedReason}
                placeholder="Select a reason"
                options={declineReasons}
                onChange={(value) => {
                  setSelectedReason(value);
                  setError("");
                }}
              />
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
              {error && showDeclineModal ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  size="md"
                  loading={loading && action === "decline"}
                  disabled={loading}
                  onClick={confirmDecline}
                >
                  Confirm decline
                </Button>
                <Button size="md" variant="secondary" disabled={loading} onClick={closeDeclineModal}>
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
