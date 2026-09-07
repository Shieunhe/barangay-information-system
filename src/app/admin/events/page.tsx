import { PageIntro } from "@/components/admin/PageIntro";

export default function EventsPage() {
  return (
    <div>
      <PageIntro
        title="Post and update events"
        description="Announce barangay activities and assign the person in charge so residents and staff know who is responsible."
      />
      <div className="rounded-xl border border-dashed border-brgy-navy/25 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-brgy-navy">Event board will go here</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brgy-muted">
          Staff will create or update an event, set the date, and assign a kagawad or office staff member.
        </p>
      </div>
    </div>
  );
}
