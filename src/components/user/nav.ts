export const userNav = [
  {
    href: "/user",
    label: "Home",
    exact: true,
  },
  {
    href: "/user/requests",
    label: "View Requests",
    exact: false,
  },
  {
    href: "/user/events",
    label: "Upcoming Events",
    exact: false,
  },
] as const;
