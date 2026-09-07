import Link from "next/link";

const requests = [
  { name: "Maria Santos", type: "Barangay Clearance", date: "Sept 7, 2026", status: "Pending" },
  { name: "Jose Ramirez", type: "Certificate of Residency", date: "Sept 6, 2026", status: "For review" },
  { name: "Ana Villanueva", type: "Indigency Certificate", date: "Sept 6, 2026", status: "Pending" },
];

export function RecentRequests() {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brgy-navy">Document requests to verify</h2>
          <p className="text-sm text-brgy-muted">Check and approve papers submitted by residents</p>
        </div>
        <Link href="/admin/documents" className="text-sm font-semibold text-brgy-navy-mid underline-offset-2 hover:underline">
          Open all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-black/10 text-brgy-muted">
            <tr>
              <th className="py-2 font-medium">Resident</th>
              <th className="py-2 font-medium">Document</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={`${request.name}-${request.type}`} className="border-b border-black/5 last:border-0">
                <td className="py-3 font-medium">{request.name}</td>
                <td className="py-3">{request.type}</td>
                <td className="py-3 text-brgy-muted">{request.date}</td>
                <td className="py-3">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
