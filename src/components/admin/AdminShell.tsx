"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNav } from "./nav";

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  today,
}: {
  children: React.ReactNode;
  today: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brgy-paper text-brgy-ink">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-brgy-navy text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brgy-gold bg-brgy-navy-mid text-center text-[11px] font-bold leading-tight text-brgy-gold">
              BRGY
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brgy-gold">
                Official Admin Portal
              </p>
              <p className="text-base font-semibold leading-tight">
                Barangay Information System
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Admin">
          {adminNav.map((item) => {
            const active = isActive(pathname, item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 transition-colors ${
                  active
                    ? "bg-white text-brgy-navy"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-[15px] font-semibold">{item.label}</span>
                <span className={`block text-xs ${active ? "text-brgy-navy-mid" : "text-white/65"}`}>
                  {item.hint}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-sm text-white/70">
          <p className="font-medium text-white">Barangay Staff</p>
          <p>Signed in for office use</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-black/10 bg-white px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-black/15 px-3 py-2 text-sm font-semibold text-brgy-navy lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
            <div>
              <p className="text-sm font-semibold text-brgy-navy">Admin Office</p>
              <p className="text-xs text-brgy-muted">{today}</p>
            </div>
          </div>
          <p className="hidden text-sm text-brgy-muted sm:block">
            For barangay officials and authorized staff
          </p>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
