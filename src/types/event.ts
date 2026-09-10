export type EventType =
  | "Relief Goods Distribution"
  | "Barangay Tournament"
  | "Clean-up Drive"
  | "Medical Mission"
  | "Community Assembly"
  | "Official Meeting"
  | "Feeding Program"
  | "Vaccination Drive"
  | "Livelihood Training"
  | "Disaster Preparedness"
  | "Youth Activity"
  | "Senior Citizen Program";

export type EventAudience =
  | "All"
  | "Barangay Official"
  | "Fisherman"
  | "Tricycle Driver"
  | "Farmer"
  | "Vendor"
  | "Construction Worker"
  | "Household Worker";

export type EventStatus = "Upcoming" | "Ongoing" | "Done";

export type BarangayEvent = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  audience: EventAudience;
  assignee: string;
  location: string;
  date: string;
  time: string;
};
