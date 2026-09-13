import type { AdminNavItem } from "@/types/adminNav";

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    exact: true,
  },
  {
    href: "/admin/documents",
    label: "Document Requests",
    exact: false,
  },
  {
    href: "/admin/residents",
    label: "Residents",
    exact: false,
  },
  {
    href: "/admin/events",
    label: "Events",
    exact: false,
  },
  {
    href: "/admin/audit-trail",
    label: "Audit Trail",
    exact: false,
  },
];
