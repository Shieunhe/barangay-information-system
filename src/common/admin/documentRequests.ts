import type { DocumentRequest, ProcessStatus, VerificationStatus } from "@/types/documentRequest";

export const pendingVerification = "Pending" satisfies VerificationStatus;
export const verified = "Verified" satisfies VerificationStatus;
export const notStarted = "—" satisfies ProcessStatus;
export const inProcess = "In process" satisfies ProcessStatus;
export const done = "Done" satisfies ProcessStatus;
export const pickedUp = "Picked up" satisfies ProcessStatus;

export const initialDocumentRequests: DocumentRequest[] = [];
