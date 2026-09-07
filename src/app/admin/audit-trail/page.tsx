import { PageIntro } from "@/components/admin/PageIntro";

export default function AuditTrailPage() {
  return (
    <div>
      <PageIntro
        title="Audit trail"
        description="A clear record of who verified a document, registered a resident, or posted an event."
      />
      <div className="rounded-xl border border-dashed border-brgy-navy/25 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-brgy-navy">Activity log will go here</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brgy-muted">
          Every important office action will appear here with the staff name, date, and what changed.
        </p>
      </div>
    </div>
  );
}
