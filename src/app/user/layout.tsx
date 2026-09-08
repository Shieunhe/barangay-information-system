import type { Metadata } from "next";
import { UserShell } from "@/components/user/UserShell";

export const metadata: Metadata = {
  title: "Resident Portal | Barangay Information System",
};

export default function UserLayout({ children }: LayoutProps<"/user">) {
  return <UserShell>{children}</UserShell>;
}
