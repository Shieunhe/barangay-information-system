"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/common/admin/adminNavItems";

export function AdminNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin">
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
            className={`rounded-lg px-3 py-3 text-[15px] font-semibold ${
              active ? "bg-white text-brgy-navy" : "text-white/90 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
