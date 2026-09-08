import type { DocumentRequest } from "@/types/documentRequest";
import { processClass, verificationClass } from "@/common/statusStyles";

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-brgy-paper/70 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-brgy-ink">{value}</p>
    </div>
  );
}

export function RequestViewModal({
  request,
  onClose,
}: {
  request: DocumentRequest;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close request details"
        className="absolute inset-0 bg-brgy-navy/50"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="border-b-4 border-brgy-gold bg-brgy-navy px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brgy-gold">
                Request details
              </p>
              <h2 className="mt-1 text-xl font-semibold">{request.id}</h2>
              <p className="mt-1 text-sm text-white/75">{request.type}</p>
            </div>
            <button
              type="button"
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-brgy-gold hover:bg-white/10"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-brgy-navy">Requested document</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Document" value={request.type} />
              <Field label="Purpose" value={request.purpose} />
              <Field label="Date filed" value={request.date} />
              <div className="rounded-lg bg-brgy-paper/70 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brgy-muted">Status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${verificationClass[request.verification]}`}>
                    {request.verification}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${processClass[request.process]}`}>
                    {request.process}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-brgy-navy">Personal information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value={request.name} />
              <Field label="Age" value={request.age} />
              <Field label="Sex" value={request.sex} />
              <Field label="Civil status" value={request.civilStatus} />
              <Field label="Date of birth" value={request.birthDate} />
              <Field label="Contact" value={request.contact} />
              <div className="sm:col-span-2">
                <Field label="Address" value={request.address} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
