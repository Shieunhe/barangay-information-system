export type ResidentStatus = "Pending" | "Registered" | "Not registered";

export function formatResidentFullName(resident: Pick<Resident, "name" | "suffix">) {
  const suffix = resident.suffix?.trim();
  return suffix ? `${resident.name} ${suffix}` : resident.name;
}

export type Resident = {
  id: number;
  userId: string;
  name: string;
  suffix: string;
  age: number;
  sex: string;
  civilStatus: string;
  birthDate: string;
  purok: string;
  address: string;
  contact: string;
  dateFiled: string;
  status: ResidentStatus;
  organization: string | null;
  declineReason: string | null;
};
