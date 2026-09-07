import Link from "next/link";

const activities = [
  { action: "Approved barangay clearance", staff: "Hon. Captain Lopez", time: "Today, 8:42 AM" },
  { action: "Registered a new resident", staff: "Secretary Reyes", time: "Yesterday, 4:15 PM" },
  { action: "Posted Clean-up Drive event", staff: "Kagawad Dela Cruz", time: "Yesterday, 10:05 AM" },
];

export function ActivityList() {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brgy-navy">Recent office activity</h2>
          <p className="text-sm text-brgy-muted">Latest entries from the audit trail</p>
        </div>
        <Link href="/admin/audit-trail" className="text-sm font-semibold text-brgy-navy-mid underline-offset-2 hover:underline">
          View trail
        </Link>
      </div>
      <ul className="divide-y divide-black/8">
        {activities.map((activity) => (
          <li key={activity.action} className="py-3 first:pt-0 last:pb-0">
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-brgy-muted">
              {activity.staff} · {activity.time}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
