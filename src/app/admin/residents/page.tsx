import { PageIntro } from "@/components/admin/PageIntro";

export default function ResidentsPage() {
  return (
    <div>
      <PageIntro
        title="Register residents"
        description="Add people who live in the barangay and keep their records for certificates and services."
      />
      <div className="rounded-xl border border-dashed border-brgy-navy/25 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-brgy-navy">Resident registry will go here</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brgy-muted">
          Staff will encode names, address, and household details so the office can find a person quickly.
        </p>
      </div>
    </div>
  );
}
