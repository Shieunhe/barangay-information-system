import type { ProcessStatus, VerificationStatus } from "@/types/documentRequest";
import type { ResidentStatus } from "@/types/resident";

export const verificationClass: Record<VerificationStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Verified: "bg-emerald-100 text-emerald-800",
};

export const processClass: Record<ProcessStatus, string> = {
  "—": "bg-zinc-100 text-zinc-500",
  "In process": "bg-sky-100 text-sky-700",
  Done: "bg-orange-100 text-orange-800",
  "Picked up": "bg-emerald-100 text-emerald-800",
};

export const residentStatusClass: Record<ResidentStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Registered: "bg-emerald-100 text-emerald-800",
  "Not registered": "bg-zinc-100 text-zinc-600",
};

export const processLabel: Record<ProcessStatus, string> = {
  "—": "N/A",
  "In process": "In Progress",
  Done: "Ready to pickup",
  "Picked up": "Picked Up",
};
