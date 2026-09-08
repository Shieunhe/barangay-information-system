"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brgy-gold text-xs font-bold text-brgy-navy">
          JD
        </span>
        <span className="hidden sm:inline">Juan Dela Cruz</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-black/10 bg-white py-1 text-brgy-ink shadow-lg"
        >
          <a
            href="/user/account"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5"
            onClick={() => setOpen(false)}
          >
            <UserIcon className="h-4 w-4" />
            My Account
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              toast("Signed out");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
