"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decideResident, getResidentUsers, residentUsersQueryKey, updateResident } from "@/services/users";
import { residentStatusClass } from "@/common/statusStyles";
import { ResidentViewModal } from "@/components/admin/residents/ResidentViewModal";
import { Button } from "@/components/common/Button";
import { Snackbar } from "@/components/common/Snackbar";
import { CurrentDateTime } from "@/components/common/CurrentDateTime";
import { formatResidentFullName, type Resident, type ResidentStatus } from "@/types/resident";

const pendingStatus = "Pending" satisfies ResidentStatus;
const registeredStatus = "Registered" satisfies ResidentStatus;
const notRegisteredStatus = "Not registered" satisfies ResidentStatus;

export function Residents() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Resident | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const residentsQuery = useQuery({
    queryKey: residentUsersQueryKey,
    queryFn: getResidentUsers,
  });

  const decideMutation = useMutation({
    mutationFn: ({
      userId,
      status,
      declineReason,
      organization,
    }: {
      userId: string;
      status: ResidentStatus;
      declineReason: string | null;
      organization: string | null;
    }) => decideResident(userId, status, declineReason, organization),
    onSuccess: (_result, { userId, status, declineReason, organization }) => {
      queryClient.setQueryData<Resident[]>(residentUsersQueryKey, (current) =>
        (current ?? []).map((resident) =>
          resident.userId === userId ? { ...resident, status, declineReason, organization } : resident,
        ),
      );
      setSnackbar({
        message: status === registeredStatus ? "Resident registered." : "Resident declined.",
        variant: "success",
      });
      setSelected(null);
    },
    onError: (_error, { status }) => {
      setSnackbar({
        message: status === registeredStatus ? "Failed to register this resident." : "Failed to decline this resident.",
        variant: "error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Resident) => updateResident(updates),
    onSuccess: (_result, updates) => {
      queryClient.setQueryData<Resident[]>(residentUsersQueryKey, (current) =>
        (current ?? []).map((resident) => (resident.userId === updates.userId ? updates : resident)),
      );
      setSelected(updates);
      setSnackbar({ message: "Resident details updated.", variant: "success" });
    },
    onError: () => {
      setSnackbar({ message: "Failed to update these details.", variant: "error" });
    },
  });

  useEffect(() => {
    if (!snackbar) {
      return;
    }

    const timeout = window.setTimeout(() => setSnackbar(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [snackbar]);

  const residents = residentsQuery.data ?? [];
  const saving = decideMutation.isPending || updateMutation.isPending;
  const loadError =
    residentsQuery.error || decideMutation.error || updateMutation.error
      ? "Could not load or update residents in Firestore."
      : "";

  const totalResidents = residents.filter((resident) => resident.status === registeredStatus).length;
  const pendingCount = residents.filter((resident) => resident.status === pendingStatus).length;
  const registeredCount = residents.filter((resident) => resident.status === registeredStatus).length;
  const notRegisteredCount = residents.filter((resident) => resident.status === notRegisteredStatus).length;

  const search = query.trim().toLowerCase();
  const visibleResidents = residents.filter((resident) => {
    if (!search) {
      return true;
    }

    return [resident.id, formatResidentFullName(resident), resident.purok, resident.address, resident.dateFiled, resident.status]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  return (
    <div className="px-6 py-6 text-brgy-ink lg:px-10 lg:py-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          <Link href="/admin/dashboard" className="hover:text-brgy-sidebar">
            Dashboard
          </Link>
          <span className="mx-1">&gt;</span> Residents
        </p>
        <CurrentDateTime />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2c3e50]">Residents</h1>
        <p className="mt-2 max-w-3xl text-base text-neutral-600">
          Review people who submitted a registration. Register them if they belong in the barangay, or mark them as not registered.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{totalResidents}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Total Residents</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{pendingCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Pending</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{registeredCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Registered</p>
        </article>
        <article className="rounded-[10px] bg-white px-5 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <p className="text-[2rem] font-bold leading-none text-[#c5a059]">{notRegisteredCount}</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-black">Not Registered</p>
        </article>
      </div>

      <label className="mb-4 flex items-center gap-3 rounded-[10px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, address, status, or ID"
          className="w-full bg-transparent text-sm text-brgy-ink outline-none placeholder:text-neutral-400"
        />
      </label>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-white">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">RESIDENT ID</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">NAME</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">ADDRESS</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">DATE FILED</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">STATUS</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#5c6bc0]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {residentsQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-neutral-400">
                    Loading residents...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-red-600">
                    {loadError}
                  </td>
                </tr>
              ) : visibleResidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-neutral-400">
                    No matching residents.
                  </td>
                </tr>
              ) : (
                visibleResidents.map((resident) => (
                  <tr key={resident.userId} className="border-b border-neutral-200 last:border-0">
                    <td className="px-5 py-4 font-medium">{resident.id}</td>
                    <td className="px-5 py-4">{formatResidentFullName(resident)}</td>
                    <td className="px-5 py-4">{[resident.address, resident.purok].filter(Boolean).join(", ")}</td>
                    <td className="px-5 py-4">{resident.dateFiled}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${residentStatusClass[resident.status]}`}>
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        className="w-[6.75rem]"
                        variant={resident.status === pendingStatus ? "primary" : "secondary"}
                        onClick={() => setSelected(resident)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <ResidentViewModal
          resident={selected}
          loading={saving}
          updateFailed={updateMutation.isError}
          onClose={() => {
            decideMutation.reset();
            updateMutation.reset();
            setSelected(null);
          }}
          onDecide={(status, declineReason, organization) => {
            if (saving) {
              return;
            }

            decideMutation.mutate({
              userId: selected.userId,
              status,
              declineReason,
              organization,
            });
          }}
          onUpdate={(updates) => {
            if (saving) {
              return;
            }

            updateMutation.reset();
            updateMutation.mutate(updates);
          }}
        />
      ) : null}

      {snackbar ? <Snackbar message={snackbar.message} variant={snackbar.variant} /> : null}
    </div>
  );
}
