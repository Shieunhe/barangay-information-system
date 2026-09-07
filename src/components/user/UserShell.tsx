"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "./AccountMenu";
import { userNav } from "./nav";

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-brgy-paper text-brgy-ink">
      <header className="border-b border-black/10 bg-brgy-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 lg:px-8">
          <Link href="/user" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brgy-gold text-center text-[10px] font-bold leading-tight text-brgy-gold">
              BRGY
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brgy-gold">
                Resident Portal
              </p>
              <p className="text-base font-semibold leading-tight">
                Barangay Information System
              </p>
            </div>
          </Link>

          <nav className="flex flex-1 flex-wrap justify-center gap-1" aria-label="Resident">
            {userNav.map((item) => {
              const active = isActive(pathname, item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active ? "bg-white text-brgy-navy" : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0">
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
