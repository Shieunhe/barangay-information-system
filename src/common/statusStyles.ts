import type { ProcessStatus, VerificationStatus } from "@/types/documentRequest";

export const verificationClass: Record<VerificationStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Verified: "bg-emerald-100 text-emerald-800",
};

export const processClass: Record<ProcessStatus, string> = {
  "—": "bg-zinc-100 text-zinc-500",
  "In process": "bg-sky-100 text-sky-800",
  Done: "bg-brgy-gold/20 text-brgy-navy",
  "Picked up": "bg-emerald-100 text-emerald-800",
};
