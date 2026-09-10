export const declineReasons = [
  "Not a resident of this barangay",
  "Incomplete or incorrect information",
  "Duplicate registration",
  "Other",
] as const;

export type DeclineReason = (typeof declineReasons)[number];
