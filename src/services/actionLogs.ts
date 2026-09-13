"use client";

import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toPhpDate, toPhpTime } from "@/common/phpTime";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { ActionLog } from "@/types/actionLog";
import type { AuditModule, AuditTrailEntry } from "@/types/auditTrail";

export const actionLogsQueryKey = ["action_logs"] as const;

const defaultStaff = "Administration";

function entriesCollection(userId: string) {
  return collection(getFirebaseDb(), "action_logs", userId, "entries");
}

async function nextActionLogId() {
  const parents = await getDocs(collection(getFirebaseDb(), "action_logs"));
  let maxId = 0;

  for (const parent of parents.docs) {
    maxId = Math.max(maxId, Number(parent.data().id) || 0);
    const entries = await getDocs(collection(parent.ref, "entries"));

    for (const entry of entries.docs) {
      maxId = Math.max(maxId, Number(entry.data().id) || 0);
    }
  }

  return maxId + 1;
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
    date: toPhpDate(log.create_date),
    time: toPhpTime(log.create_date),
    staff: log.staff,
    module: toAuditModule(log.module),
    action: log.action,
    details: log.details,
    residentName: log.resident_name,
  };
}

export async function createActionLog(fields: {
  userId: string;
  residentName: string;
  module: string;
  action: string;
  details: string;
}) {
  const now = new Date().toISOString();
  const id = await nextActionLogId();
  const record: ActionLog = {
    id,
    user_id: fields.userId,
    resident_name: fields.residentName,
    module: fields.module,
    action: fields.action,
    details: fields.details,
    staff: defaultStaff,
    create_date: now,
    update_date: now,
  };

  await setDoc(
    doc(getFirebaseDb(), "action_logs", fields.userId),
    { user_id: fields.userId },
    { merge: true },
  );
  await addDoc(entriesCollection(fields.userId), record);

  return record;
}

export async function getActionLogs(): Promise<AuditTrailEntry[]> {
  const parents = await getDocs(collection(getFirebaseDb(), "action_logs"));
  const entries: { id: string; log: ActionLog }[] = [];

  for (const parent of parents.docs) {
    const nested = await getDocs(collection(parent.ref, "entries"));

    if (!nested.empty) {
      for (const entry of nested.docs) {
        entries.push({ id: entry.id, log: entry.data() as ActionLog });
      }
      continue;
    }

    const log = parent.data() as ActionLog;

    if (log.action) {
      entries.push({ id: parent.id, log });
    }
  }

  return entries
    .sort((left, right) => right.log.create_date.localeCompare(left.log.create_date))
    .map(({ id, log }) => toAuditTrailEntry(id, log));
}

export function useActionLogs() {
  return useQuery({
    queryKey: actionLogsQueryKey,
    queryFn: getActionLogs,
    staleTime: 0,
    refetchOnMount: true,
  });
}
