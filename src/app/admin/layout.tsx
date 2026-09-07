import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Barangay Information System",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return <AdminShell today={today}>{children}</AdminShell>;
}
