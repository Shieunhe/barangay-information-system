import { ActivityList } from "@/components/dashboard/ActivityList";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { RequestStatusChart } from "@/components/dashboard/RequestStatusChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { PageIntro } from "@/components/admin/PageIntro";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageIntro
        title="Barangay Dashboard"
        description="View of work that needs attention: papers to verify, people to register, events to post, and a record of office actions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending documents" value="8" detail="Need verification today" />
        <StatCard label="Registered residents" value="1,248" detail="People listed in the barangay" />
        <StatCard label="Upcoming events" value="3" detail="With assigned staff" />
        <StatCard label="Audit entries" value="26" detail="Recorded this week" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentRequests />
        </div>
        <div className="xl:col-span-2">
          <UpcomingEvents />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RequestStatusChart />
        <ActivityList />
      </div>
    </div>
  );
}
