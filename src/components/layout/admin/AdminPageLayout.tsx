"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSideBar } from "./adminSideBar/AdminSideBar";

export function AdminPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOpen(desktop.matches);

    sync();
    desktop.addEventListener("change", sync);

    return () => desktop.removeEventListener("change", sync);
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <AdminSideBar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {open ? null : (
          <button
            type="button"
            aria-label="Open sidebar"
            className="m-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brgy-sidebar text-white shadow-sm"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
