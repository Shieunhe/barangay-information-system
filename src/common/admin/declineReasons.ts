export const declineReasons = [
  "Not a resident of this barangay",
  "Incomplete or unclear National ID",
  "Information does not match the ID",
  "Duplicate registration",
  "Other",
] as const;

export type DeclineReason = (typeof declineReasons)[number];
