import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { UserOrganization } from "@/types/userOrganization";

function organizationRef(uid: string) {
  return doc(getFirebaseDb(), "user_organizations", uid);
}

async function nextOrganizationId() {
  const snapshot = await getDocs(collection(getFirebaseDb(), "user_organizations"));

  return snapshot.docs.reduce((max, entry) => Math.max(max, Number(entry.data().id) || 0), 0) + 1;
}

export async function getUserOrganizationsByUid() {
  const snapshot = await getDocs(collection(getFirebaseDb(), "user_organizations"));
  const latest = new Map<string, UserOrganization>();

  for (const entry of snapshot.docs) {
    const organization = entry.data() as UserOrganization;
    latest.set(entry.id, organization);
  }

  return latest;
}

export async function createUserOrganization(uid: string, organization: string) {
  const now = new Date().toISOString();
  const ref = organizationRef(uid);
  const id = await nextOrganizationId();
  const record: UserOrganization = {
    id,
    uid,
    organization,
    create_date: now,
    update_date: now,
  };

  await setDoc(ref, record);

  return record;
}

export async function updateUserOrganization(uid: string, organization: string) {
  const ref = organizationRef(uid);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    return createUserOrganization(uid, organization);
  }

  const current = existing.data() as UserOrganization;
  const now = new Date().toISOString();
  const record: UserOrganization = {
    id: current.id,
    uid,
    organization,
    create_date: current.create_date,
    update_date: now,
  };

  await setDoc(ref, record);

  return record;
}
