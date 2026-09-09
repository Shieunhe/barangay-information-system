export type ResidentStatus = "Pending" | "Registered" | "Not registered";

export type Resident = {
  id: string;
  name: string;
  age: number;
  sex: string;
  civilStatus: string;
  birthDate: string;
  address: string;
  contact: string;
  dateFiled: string;
  status: ResidentStatus;
  nationalIdFront: string;
  nationalIdBack: string;
  declineReason: string | null;
};
