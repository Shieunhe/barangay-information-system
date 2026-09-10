import type { EventStatus, EventType } from "@/types/event";
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

export const eventStatusClass: Record<EventStatus, string> = {
  Upcoming: "bg-sky-100 text-sky-800",
  Ongoing: "bg-amber-100 text-amber-800",
  Done: "bg-emerald-100 text-emerald-800",
};

export const eventTypeClass: Record<EventType, string> = {
  "Relief Goods Distribution": "bg-emerald-100 text-emerald-800",
  "Barangay Tournament": "bg-sky-100 text-sky-800",
  "Clean-up Drive": "bg-amber-100 text-amber-800",
  "Medical Mission": "bg-rose-100 text-rose-800",
  "Community Assembly": "bg-indigo-100 text-indigo-800",
  "Official Meeting": "bg-slate-100 text-slate-700",
  "Feeding Program": "bg-orange-100 text-orange-800",
  "Vaccination Drive": "bg-teal-100 text-teal-800",
  "Livelihood Training": "bg-violet-100 text-violet-800",
  "Disaster Preparedness": "bg-red-100 text-red-800",
  "Youth Activity": "bg-cyan-100 text-cyan-800",
  "Senior Citizen Program": "bg-fuchsia-100 text-fuchsia-800",
};
