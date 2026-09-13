"use client";

import { AdminNav } from "../adminNav/AdminNav";

export function AdminSideBar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-screen w-72 shrink-0 flex-col overflow-visible bg-brgy-sidebar transition-transform lg:sticky lg:top-0 lg:self-start ${
          open ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-white/10 px-5 py-5 pr-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b5b5b5] text-center text-[11px] font-bold leading-tight text-white">
              BRGY
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                Official Admin Portal
              </p>
              <p className="text-base font-semibold leading-tight text-white">
                Barangay Information System
              </p>
            </div>
          </div>
        </div>

        <AdminNav onClose={onClose} />

        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6 9 12l6 6" />
          </svg>
        </button>
      </aside>
    </>
  );
}