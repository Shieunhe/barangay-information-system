import { CalendarDays } from "lucide-react";

const events = [
  { title: "Clean-up Drive", date: "Sept 10, 8:00 AM", location: "Barangay Hall Grounds" },
  { title: "Senior Citizen Assembly", date: "Sept 12, 2:00 PM", location: "Multi-Purpose Hall" },
  { title: "Health Mission", date: "Sept 15, 9:00 AM", location: "Covered Court" },
];

export default function UpcomingEventsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">
          Upcoming Events
        </h1>
        <p className="mt-2 max-w-2xl text-base text-brgy-muted">
          Activities and announcements posted by the barangay office.
        </p>
      </div>

      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.title}
            className="flex items-start gap-3 rounded-xl border border-black/8 bg-white p-5 shadow-sm"
          >
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-brgy-navy" />
            <div>
              <p className="font-semibold text-brgy-navy">{event.title}</p>
              <p className="text-sm text-brgy-muted">{event.date}</p>
              <p className="mt-1 text-sm">{event.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
