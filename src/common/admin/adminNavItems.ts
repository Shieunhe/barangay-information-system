import type { AdminNavItem } from "@/types/adminNav";

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Overview",
    exact: true,
  },
  {
    href: "/admin/documents",
    label: "Document Requests",
    exact: false,
  },
  {
    href: "/admin/audit-trail",
    label: "Audit Trail",
    exact: false,
  },
];
