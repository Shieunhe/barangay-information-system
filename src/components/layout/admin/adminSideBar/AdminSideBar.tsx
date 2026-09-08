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
        className={`fixed inset-y-0 left-0 z-30 flex w-[240px] shrink-0 flex-col bg-[#1a4d8c] transition-transform lg:static ${
          open ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="h-9 w-9 shrink-0 rounded-full bg-white/90" />
          <p className="text-lg font-semibold text-white">BMI System</p>
        </div>

        <AdminNav onClose={onClose} />

        <div className="mt-auto flex items-center gap-3 px-5 py-6 text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </span>
          <p className="text-sm">Admin Staff</p>
        </div>

        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white lg:hidden"
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
