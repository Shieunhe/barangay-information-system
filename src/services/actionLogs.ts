import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { ActionLog } from "@/types/actionLog";
import type { AuditModule, AuditTrailEntry } from "@/types/auditTrail";

export const actionLogsQueryKey = ["action_logs"] as const;

const digitsForDocumentId = "0123456789";
const defaultStaff = "Administration";

function createSixDigitDocumentId() {
  return Array.from({ length: 6 }, () => digitsForDocumentId[Math.floor(Math.random() * digitsForDocumentId.length)]).join("");
}

async function nextActionLogId() {
  const snapshot = await getDocs(collection(getFirebaseDb(), "action_logs"));

  return snapshot.docs.reduce((max, entry) => Math.max(max, Number(entry.data().id) || 0), 0) + 1;
}

async function nextActionLogRef() {
  const db = getFirebaseDb();

  for (;;) {
    const ref = doc(db, "action_logs", createSixDigitDocumentId());

    if (!(await getDoc(ref)).exists()) {
      return ref;
    }
  }
}

function formatLogDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function formatLogTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function toAuditModule(module: string): AuditModule {
  if (module === "documents") {
    return "Documents";
  }

  if (module === "events") {
    return "Events";
  }

  if (module === "system") {
    return "System";
  }

  return "Residents";
}

function toAuditTrailEntry(docId: string, log: ActionLog): AuditTrailEntry {
  return {
    id: docId,
    date: formatLogDate(log.create_date),
    time: formatLogTime(log.create_date),
    staff: log.staff,
    module: toAuditModule(log.module),
    action: log.action,
    details: log.details,
    residentName: log.resident_name,
  };
}

export async function createActionLog(fields: {
  uid: string;
  residentName: string;
  module: string;
  action: string;
  details: string;
}) {
  const now = new Date().toISOString();
  const ref = await nextActionLogRef();
  const id = await nextActionLogId();
  const record: ActionLog = {
    id,
    uid: fields.uid,
    resident_name: fields.residentName,
    module: fields.module,
    action: fields.action,
    details: fields.details,
    staff: defaultStaff,
    create_date: now,
    update_date: now,
  };

  await setDoc(ref, record);

  return record;
}

export async function getActionLogs(): Promise<AuditTrailEntry[]> {
  const snapshot = await getDocs(collection(getFirebaseDb(), "action_logs"));

  return snapshot.docs
    .map((entry) => ({ entry, log: entry.data() as ActionLog }))
    .sort((left, right) => right.log.create_date.localeCompare(left.log.create_date))
    .map(({ entry, log }) => toAuditTrailEntry(entry.id, log));
}
