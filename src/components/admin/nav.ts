export const adminNav = [
  {
    href: "/admin",
    label: "Dashboard",
    hint: "Overview of barangay work",
    exact: true,
  },
  {
    href: "/admin/documents",
    label: "Document Requests",
    hint: "Verify resident document requests",
    exact: false,
  },
  {
    href: "/admin/residents",
    label: "Residents",
    hint: "Register people in the barangay",
    exact: false,
  },
  {
    href: "/admin/events",
    label: "Events",
    hint: "Post updates and assign staff",
    exact: false,
  },
  {
    href: "/admin/audit-trail",
    label: "Audit Trail",
    hint: "Review recorded activity",
    exact: false,
  },
] as const;
