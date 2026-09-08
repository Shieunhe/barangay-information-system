"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/common/admin/adminNavItems";

export function AdminNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-2 px-4" aria-label="Admin">
      {adminNavItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (window.matchMedia("(max-width: 1023px)").matches) {
                onClose();
              }
            }}
            className={`rounded-full px-4 py-2.5 text-[15px] font-medium ${
              active ? "bg-white text-[#1a4d8c]" : "text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
