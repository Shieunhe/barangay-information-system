import { PageIntro } from "@/components/admin/PageIntro";

export default function DocumentRequestsPage() {
  return (
    <div>
      <PageIntro
        title="Verify document requests"
        description="Review papers requested by residents, such as clearances and certificates, then approve or return them."
      />
      <div className="rounded-xl border border-dashed border-brgy-navy/25 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-brgy-navy">Verification list will go here</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brgy-muted">
          Staff will see each request, the resident name, and buttons to approve or send back for correction.
        </p>
      </div>
    </div>
  );
}
