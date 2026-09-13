export type AuditModule = "Documents" | "Events" | "Residents" | "System";

export type AuditTrailEntry = {
  id: string;
  date: string;
  time: string;
  staff: string;
  module: AuditModule;
  action: string;
  details: string;
  residentName: string;
};
