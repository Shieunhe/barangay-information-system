export const organizations = [
  "None",
  "Barangay Official",
  "Fisherman",
  "Tricycle Driver",
  "Farmer",
  "Vendor",
  "Construction Worker",
  "Household Worker",
] as const;

export type Organization = (typeof organizations)[number];
