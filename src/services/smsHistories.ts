"use client";

import { doc, updateDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { getFirebaseDb } from "@/lib/firebase/client";

// sms_histories is not used yet. Keep a static code until that feature is added.
const staticVerificationCode = "123456";

// import { addDoc, collection, getDocs, query, where, type DocumentReference } from "firebase/firestore";
// import type { SmsHistory } from "@/types/smsHistory";
//
// function smsHistoriesCollection() {
//   return collection(getFirebaseDb(), "sms_histories");
// }
//
// async function nextSmsHistoryId() { ... }
// async function getSmsHistoriesByUid(uid: string) { ... }

export async function sendSmsHistoryCode(uid: string, userId: string, email: string) {
  void uid;
  void userId;

  // await addDoc(smsHistoriesCollection(), {
  //   id: await nextSmsHistoryId(),
  //   uid,
  //   user_id: userId,
  //   email,
  //   code,
  //   status: "pending",
  //   ...
  // });

  return {
    email,
    previewCode: staticVerificationCode,
  };
}

export async function verifySmsHistoryCode(uid: string, code: string) {
  if (code.trim() !== staticVerificationCode) {
    throw new Error("The verification code is incorrect.");
  }

  const now = new Date().toISOString();
  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    status: "account verification",
    update_date: now,
  });

  // const latest = latestPendingHistory(await getSmsHistoriesByUid(uid));
  // if (latest.data.code !== code.trim()) { throw ... }
  // await updateDoc(latest.ref, { status: "used", update_date: now });

  return { uid };
}

export function useSendSmsHistoryCode() {
  return useMutation({
    mutationFn: ({ uid, userId, email }: { uid: string; userId: string; email: string }) =>
      sendSmsHistoryCode(uid, userId, email),
  });
}

export function useVerifySmsHistoryCode() {
  return useMutation({
    mutationFn: ({ uid, code }: { uid: string; code: string }) => verifySmsHistoryCode(uid, code),
  });
}
