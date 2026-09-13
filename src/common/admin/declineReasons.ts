export const declineReasons = [
  "Not a resident of this barangay",
  "Incomplete or incorrect information",
  "Duplicate registration",
  "Not a resident of this purok",
  "Other",
] as const;

export type DeclineReason = (typeof declineReasons)[number];
