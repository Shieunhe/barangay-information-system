export type VerificationStatus = "Pending" | "Verified";
export type ProcessStatus = "—" | "In process" | "Done" | "Picked up";

export type DocumentRequest = {
  id: string;
  name: string;
  type: string;
  date: string;
  verification: VerificationStatus;
  process: ProcessStatus;
  purpose: string;
  age: number;
  sex: string;
  civilStatus: string;
  birthDate: string;
  address: string;
  contact: string;
};
