"use client";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";
import { actionLogsQueryKey, createActionLog } from "@/services/actionLogs";
import type { BarangayEvent, EventListRecord } from "@/types/event";

export const eventListQueryKey = ["event_list"] as const;

function eventListCollection() {
  return collection(getFirebaseDb(), "event_list");
}

function toBarangayEvent(record: EventListRecord): BarangayEvent {
  return {
    id: record.event_id,
    title: record.title,
    description: record.description,
    type: record.type,
    audience: record.audience,
    assignee: record.assignee,
    location: record.location,
    date: record.date,
    time: record.time,
  };
}

async function nextEventId() {
  const snapshot = await getDocs(eventListCollection());
  let maxId = 0;

  for (const entry of snapshot.docs) {
    const record = entry.data() as EventListRecord;
    const match = (record.event_id || entry.id).match(/(\d+)$/);
    maxId = Math.max(maxId, Number(match?.[1]) || 0);
  }

  return `EV-${String(maxId + 1).padStart(3, "0")}`;
}

export async function getEventList(): Promise<BarangayEvent[]> {
  const snapshot = await getDocs(eventListCollection());

  return snapshot.docs
    .map((entry) => toBarangayEvent(entry.data() as EventListRecord))
    .sort((left, right) => {
      const byDate = right.date.localeCompare(left.date);
      return byDate !== 0 ? byDate : right.time.localeCompare(left.time);
    });
}

export async function createEventListItem(fields: Omit<BarangayEvent, "id">) {
  const now = new Date().toISOString();
  const eventId = await nextEventId();
  const record: EventListRecord = {
    event_id: eventId,
    title: fields.title,
    description: fields.description,
    type: fields.type,
    audience: fields.audience,
    assignee: fields.assignee,
    location: fields.location,
    date: fields.date,
    time: fields.time,
    create_date: now,
    update_date: now,
  };

  await setDoc(doc(getFirebaseDb(), "event_list", eventId), record);

  const actorId = getFirebaseAuth().currentUser?.uid || "admin";
  await createActionLog({
    userId: actorId,
    residentName: record.audience === "None" ? "All residents" : record.audience,
    module: "events",
    action: "Posted event",
    details: `Posted ${record.title} at ${record.location} on ${record.date}.`,
  });

  return toBarangayEvent(record);
}

export function useEventList() {
  return useQuery({
    queryKey: eventListQueryKey,
    queryFn: getEventList,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateEventListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: Omit<BarangayEvent, "id">) => createEventListItem(fields),
    onSuccess: (created) => {
      queryClient.setQueryData<BarangayEvent[]>(eventListQueryKey, (current) => [created, ...(current ?? [])]);
      queryClient.invalidateQueries({ queryKey: actionLogsQueryKey });
    },
  });
}
