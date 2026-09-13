import type { Metadata } from "next";
import { AdminPageLayout } from "@/components/layout/admin/AdminPageLayout";

export const metadata: Metadata = {
  title: "BMI | Barangay Information System",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminPageLayout>{children}</AdminPageLayout>;
}
