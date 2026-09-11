import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { createActionLog } from "@/services/actionLogs";
import { createUserOrganization, getUserOrganizationsByUid, updateUserOrganization } from "@/services/userOrganizations";
import { formatResidentFullName, type Resident, type ResidentStatus } from "@/types/resident";
import { USER_ROLE, type Users, type UserStatus } from "@/types/user";

export const residentUsersQueryKey = ["users", "residents"] as const;

const digitsForDocumentId = "0123456789";

function formatName(user: Users) {
  return [user.first_name, user.middle_name, user.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
}

function toResidentStatus(status: UserStatus): ResidentStatus {
  if (status === "registered") {
    return "Registered";
  }

  if (status === "not registered") {
    return "Not registered";
  }

  return "Pending";
}

function toUserStatus(status: ResidentStatus): UserStatus {
  if (status === "Registered") {
    return "registered";
  }

  if (status === "Not registered") {
    return "not registered";
  }

  return "pending";
}

function createSixDigitDocumentId() {
  return Array.from({ length: 6 }, () => digitsForDocumentId[Math.floor(Math.random() * digitsForDocumentId.length)]).join("");
}

function toResident(userId: string, user: Users): Resident {
  return {
    id: user.id,
    userId,
    name: formatName(user),
    suffix: user.suffix?.trim() ?? "",
    age: user.age,
    sex: user.sex,
    civilStatus: user.civil_status,
    birthDate: user.date_of_birth,
    purok: user.purok,
    address: user.permanent_address,
    contact: user.contact_number,
    dateFiled: user.create_date,
    status: toResidentStatus(user.status),
    organization: null,
    declineReason: user.decline_reason || null,
  };
}

async function nextResidentId() {
  const snapshot = await getDocs(collection(getFirebaseDb(), "users"));

  return snapshot.docs.reduce((max, entry) => Math.max(max, Number(entry.data().id) || 0), 0) + 1;
}

async function nextUserDocRef() {
  const db = getFirebaseDb();

  for (;;) {
    const userId = createSixDigitDocumentId();
    const userRef = doc(db, "users", userId);

    if (!(await getDoc(userRef)).exists()) {
      return userRef;
    }
  }
}

export async function getResidentUsers(): Promise<Resident[]> {
  const [snapshot, organizations] = await Promise.all([
    getDocs(query(collection(getFirebaseDb(), "users"), where("role", "==", USER_ROLE))),
    getUserOrganizationsByUid(),
  ]);

  return snapshot.docs
    .map((entry) => {
      const resident = toResident(entry.id, entry.data() as Users);
      return {
        ...resident,
        organization: organizations.get(entry.id)?.organization ?? null,
      };
    })
    .sort((left, right) => left.id - right.id);
}

export async function createResidentUser(fields: Omit<Users, "id" | "role">) {
  const userRef = await nextUserDocRef();
  const id = await nextResidentId();

  await setDoc(userRef, {
    id,
    role: USER_ROLE,
    ...fields,
  });

  return { id, userId: userRef.id };
}

export async function decideResident(
  userId: string,
  status: ResidentStatus,
  declineReason: string | null,
  organization: string | null,
  residentName: string,
) {
  await updateDoc(doc(getFirebaseDb(), "users", userId), {
    status: toUserStatus(status),
    decline_reason: declineReason ?? "",
    update_date: new Date().toISOString(),
  });

  if (status === "Registered" && organization) {
    await createUserOrganization(userId, organization);
    await createActionLog({
      uid: userId,
      residentName,
      module: "residents",
      action: "Registered resident",
      details: `Registered ${residentName} and assigned ${organization}.`,
    });
    return;
  }

  await createActionLog({
    uid: userId,
    residentName,
    module: "residents",
    action: "Declined resident",
    details: `Declined ${residentName}. Reason: ${declineReason || "No reason provided"}.`,
  });
}

function splitFullName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.length > 1 ? parts[parts.length - 1] : first_name;
  const middle_name = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

  return { first_name, middle_name, last_name };
}

function describeChange(from: string, to: string) {
  if (from === to) {
    return null;
  }

  return `from ${from || "none"} to ${to || "none"}`;
}

export async function updateResident(resident: Resident) {
  const userRef = doc(getFirebaseDb(), "users", resident.userId);
  const existing = (await getDoc(userRef)).data() as Users | undefined;
  const organizations = await getUserOrganizationsByUid();
  const previousOrganization = organizations.get(resident.userId)?.organization ?? "";
  const { first_name, middle_name, last_name } = splitFullName(resident.name);
  const previousName = existing
    ? formatResidentFullName({
        name: formatName(existing),
        suffix: existing.suffix,
      })
    : "";
  const nextName = formatResidentFullName(resident);

  await setDoc(userRef, {
    id: existing?.id ?? resident.id,
    role: existing?.role ?? USER_ROLE,
    first_name,
    middle_name,
    last_name,
    date_of_birth: resident.birthDate,
    suffix: resident.suffix?.trim() ?? "",
    age: resident.age,
    civil_status: resident.civilStatus,
    sex: resident.sex,
    permanent_address: resident.address,
    purok: resident.purok,
    contact_number: resident.contact,
    email: existing?.email ?? "",
    status: toUserStatus(resident.status),
    decline_reason: resident.declineReason ?? "",
    create_date: existing?.create_date ?? resident.dateFiled,
    update_date: new Date().toISOString(),
  } satisfies Users);

  if (resident.status === "Registered" && resident.organization) {
    await updateUserOrganization(resident.userId, resident.organization);
  }

  const changes = [
    describeChange(previousName, nextName),
    describeChange(existing ? String(existing.age) : "", String(resident.age)),
    describeChange(existing?.sex ?? "", resident.sex),
    describeChange(existing?.civil_status ?? "", resident.civilStatus),
    describeChange(existing?.date_of_birth ?? "", resident.birthDate),
    describeChange(existing?.permanent_address ?? "", resident.address),
    describeChange(existing?.purok ?? "", resident.purok),
    describeChange(existing?.contact_number ?? "", resident.contact),
    describeChange(previousOrganization, resident.organization ?? ""),
  ].filter((change): change is string => Boolean(change));

  await createActionLog({
    uid: resident.userId,
    residentName: nextName,
    module: "residents",
    action: "Updated resident",
    details:
      changes.length > 0
        ? `Updated ${nextName} ${changes.join(", ")}.`
        : `Updated ${nextName}.`,
  });
}
