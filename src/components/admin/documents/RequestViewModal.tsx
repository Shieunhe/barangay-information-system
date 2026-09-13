import type { DocumentRequest } from "@/types/documentRequest";
import { Button } from "@/components/common/Button";
import { processClass, processLabel, verificationClass } from "@/common/statusStyles";

function DocumentField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">{label}</p>
      <p className="mt-1 text-sm font-medium text-brgy-ink">{value}</p>
    </div>
  );
}

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

export function RequestViewModal({
  request,
  nextAction,
  loading,
  onClose,
  onNextAction,
}: {
  request: DocumentRequest;
  nextAction: string | null;
  loading: boolean;
  onClose: () => void;
  onNextAction: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close request details"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="bg-brgy-sidebar px-5 py-4 text-white">
          <p className="text-sm text-white/80">Request details</p>
          <h2 className="mt-1 text-2xl font-semibold">{request.id}</h2>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section>
            <SectionTitle>Requested Document</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <DocumentField label="Type of document" value={request.type} />
              <DocumentField label="Purpose" value={request.purpose} />
              <DocumentField label="Date filed" value={request.date} />
              <div className="rounded-lg border border-[#c5d4f0] px-3 py-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">
                      Verification
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${verificationClass[request.verification]}`}
                    >
                      {request.verification}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-sidebar">Status</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${processClass[request.process]}`}
                    >
                      {processLabel[request.process]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Full name" value={request.name} />
              <InfoField label="Age" value={`${request.age} years old`} />
              <InfoField label="Sex" value={request.sex} />
              <InfoField label="Civil status" value={request.civilStatus} />
              <InfoField label="Date of birth" value={request.birthDate} />
              <InfoField label="Contact number" value={request.contact} />
              <div className="sm:col-span-2">
                <InfoField label="Address" value={request.address} />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {nextAction ? (
              <Button size="md" loading={loading} onClick={onNextAction}>
                {nextAction}
              </Button>
            ) : null}
            <Button size="md" variant="secondary" onClick={onClose}>
              Close Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
