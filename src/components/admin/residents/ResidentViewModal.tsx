"use client";

import { useEffect, useRef, useState } from "react";
import { declineReasons } from "@/common/admin/declineReasons";
import { organizations } from "@/common/admin/organizations";
import { puroks } from "@/common/admin/userOptions";
import { toPhpDateTime } from "@/common/phpTime";
import { formatPhMobile, isPhMobile } from "@/common/phMobile";
import { residentStatusClass } from "@/common/statusStyles";
import { Button } from "@/components/common/Button";
import { formatResidentFullName, type Resident, type ResidentStatus } from "@/types/resident";

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
  inputMode,
  maxLength,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "text";
  maxLength?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
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
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
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
  updateFailed = false,
  onClose,
  onDecide,
  onUpdate,
}: {
  resident: Resident;
  loading: boolean;
  updateFailed?: boolean;
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
  const wasLoading = useRef(false);
  const isPending = resident.status === "Pending" || resident.status === "Account verification";
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
    if (!organization.trim()) {
      setError("Select an organization before registering.");
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

    if (!name || !address || !contact || !birthDate || !draft.sex || !draft.civilStatus || !draft.purok) {
      setError("Fill in all resident details.");
      return;
    }

    if (!isPhMobile(contact)) {
      setError("Contact number must be 11 digits and start with 09.");
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
      suffix: draft.suffix.trim(),
      age,
      sex: draft.sex,
      civilStatus: draft.civilStatus,
      birthDate,
      purok: draft.purok,
      address,
      contact,
      organization: draft.organization,
    });
  }

  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
      return;
    }

    if (action === "update" && wasLoading.current) {
      wasLoading.current = false;
      setAction(null);

      if (updateFailed) {
        return;
      }

      setEditing(false);
      setDraft(resident);
    }
  }, [action, loading, resident, updateFailed]);

  function confirmDecline() {
    if (!selectedReason) {
      setError("Select a decline reason.");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      setError("Type the reason when you choose Other.");
      return;
    }

    const reason = resolveDeclineReason();

    if (!reason) {
      setError("Select a decline reason.");
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
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
        <div className="bg-brgy-sidebar px-5 py-4 text-white">
          <p className="text-sm text-white/80">Resident registration ID</p>
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
                  <TextField label="Suffix" value={draft.suffix} onChange={(value) => updateDraft("suffix", value)} />
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
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={draft.contact}
                    onChange={(value) => updateDraft("contact", formatPhMobile(value))}
                  />
                  <TextField label="Address" value={draft.address} onChange={(value) => updateDraft("address", value)} />
                  <SelectField
                    label="Purok"
                    value={draft.purok}
                    placeholder="Select purok"
                    options={puroks}
                    onChange={(value) => updateDraft("purok", value)}
                  />
                  <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                      {resident.status}
                    </span>
                  </div>
                  <InfoField label="Date filed" value={toPhpDateTime(resident.dateFiled)} />
                  <div className="sm:col-span-2">
                    <SelectField
                      label="Organization"
                      value={draft.organization ?? ""}
                      placeholder="Select organization"
                      options={organizations}
                      required
                      onChange={(value) => updateDraft("organization", value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <InfoField label="Full name" value={formatResidentFullName(resident)} />
                  <InfoField label="Age" value={`${resident.age} years old`} />
                  <InfoField label="Sex" value={resident.sex} />
                  <InfoField label="Civil status" value={resident.civilStatus} />
                  <InfoField label="Date of birth" value={resident.birthDate} />
                  <InfoField label="Contact number" value={resident.contact} />
                  <InfoField label="Address" value={resident.address} />
                  <InfoField label="Purok" value={resident.purok} />
                  <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                      {resident.status}
                    </span>
                  </div>
                  <InfoField label="Date filed" value={toPhpDateTime(resident.dateFiled)} />
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
                required
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
                  onClick={handleRegister}
                >
                  Register
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={openDeclineModal}
                >
                  Decline
                </Button>
              </>
            ) : null}
            {isRegistered && !editing ? (
              <Button size="md" onClick={startEditing}>
                Edit
              </Button>
            ) : null}
            {isRegistered && editing ? (
              <>
                <Button size="md" onClick={handleUpdate}>
                  Save
                </Button>
                <Button size="md" variant="secondary" onClick={cancelEditing}>
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
        {loading ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
            <span
              aria-hidden
              className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            <span className="sr-only">Saving</span>
          </div>
        ) : null}
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
                required
                onChange={(value) => {
                  setSelectedReason(value);
                  setError("");
                }}
              />
              {selectedReason === "Other" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
                    Type the reason <span className="text-red-600">*</span>
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
