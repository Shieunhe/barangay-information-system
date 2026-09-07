import Link from "next/link";

const events = [
  { title: "Clean-up Drive", date: "Sept 10, 8:00 AM", assignee: "Kagawad Dela Cruz" },
  { title: "Senior Citizen Assembly", date: "Sept 12, 2:00 PM", assignee: "Secretary Reyes" },
  { title: "Health Mission", date: "Sept 15, 9:00 AM", assignee: "Nurse Bautista" },
];

export function UpcomingEvents() {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brgy-navy">Upcoming Events</h2>
          <p className="text-sm text-brgy-muted">Posted activities with assigned staff</p>
        </div>
        <Link href="/admin/events" className="text-sm font-semibold text-brgy-navy-mid underline-offset-2 hover:underline">
          Manage events
        </Link>
      </div>
      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.title} className="rounded-lg border border-black/8 px-3 py-3">
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-brgy-muted">{event.date}</p>
            <p className="mt-1 text-sm">
              Assigned to <span className="font-medium text-brgy-navy">{event.assignee}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
