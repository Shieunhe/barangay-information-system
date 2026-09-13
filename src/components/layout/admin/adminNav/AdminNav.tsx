"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems } from "@/common/admin/adminNavItems";
import { useSignOutAdmin } from "@/services/auth";

export function AdminNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useSignOutAdmin();

  function handleLogout() {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/admin/login");
      },
    });
  }

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 py-4 pl-3" aria-label="Admin">
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
            className={`relative px-4 py-3 text-[15px] font-semibold ${
              active
                ? "z-10 rounded-l-3xl bg-brgy-sidebar-active text-brgy-sidebar-text"
                : "text-white hover:bg-white/10"
            }`}
          >
            {active ? (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-5 right-0 h-5 w-5 bg-brgy-sidebar-active before:absolute before:inset-0 before:rounded-br-full before:bg-brgy-sidebar before:content-['']"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-5 right-0 h-5 w-5 bg-brgy-sidebar-active before:absolute before:inset-0 before:rounded-tr-full before:bg-brgy-sidebar before:content-['']"
                />
              </>
            ) : null}
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        disabled={logoutMutation.isPending}
        onClick={handleLogout}
        className="mt-auto mb-3 px-4 py-3 text-left text-[15px] font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {logoutMutation.isPending ? "Logging out..." : "Log out"}
      </button>
    </nav>
  );
}
