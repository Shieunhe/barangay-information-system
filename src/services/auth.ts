"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { PERMANENT_ADDRESS } from "@/common/admin/userOptions";
import { isPhMobile } from "@/common/phMobile";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";
import { createResidentUser } from "@/services/users";
// import { sendSmsHistoryCode } from "@/services/smsHistories";
import type { Users } from "@/types/user";

export type ResidentSignupFields = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  status: string;
  purok: string;
  contactNumber: string;
  email: string;
  password: string;
};

export function firebaseAuthMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Incorrect email or password.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/missing-password":
        return "Enter your password.";
      case "auth/missing-email":
        return "Enter your email address.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export async function registerResidentAccount(fields: ResidentSignupFields) {
  const email = fields.email.trim().toLowerCase();
  const existing = await getDocs(query(collection(getFirebaseDb(), "users"), where("email", "==", email)));

  if (!existing.empty) {
    throw new Error("This email is already registered.");
  }

  const contactNumber = fields.contactNumber.trim();

  if (!isPhMobile(contactNumber)) {
    throw new Error("Contact number must be 11 digits and start with 09.");
  }

  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, fields.password);
  const now = new Date().toISOString();
  const profile: Omit<Users, "id" | "role" | "user_id"> = {
    first_name: fields.firstName.trim(),
    middle_name: fields.middleName.trim(),
    last_name: fields.lastName.trim(),
    date_of_birth: fields.dateOfBirth,
    suffix: fields.suffix.trim(),
    age: Number(fields.age) || 0,
    civil_status: fields.status,
    sex: fields.gender,
    permanent_address: PERMANENT_ADDRESS,
    purok: fields.purok,
    contact_number: contactNumber,
    email,
    status: "pending",
    decline_reason: "",
    create_date: now,
    update_date: now,
  };

  try {
    const created = await createResidentUser(credential.user.uid, profile);
    // sms_histories / email verification is not wired yet.
    // const verification = await sendSmsHistoryCode(credential.user.uid, created.user_id, email);
    return {
      ...created,
      email,
    };
  } catch (error) {
    await credential.user.delete();
    throw error;
  }
}

export async function signInResident(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim().toLowerCase(),
    password,
  );
  const snapshot = await getDoc(doc(getFirebaseDb(), "users", credential.user.uid));

  if (!snapshot.exists()) {
    throw new Error("No resident profile found for this account.");
  }

  const user = snapshot.data() as Users;

  return {
    uid: credential.user.uid,
    user,
  };
}

export async function sendResidentPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email.trim().toLowerCase());
}

export function useRegisterResident() {
  return useMutation({
    mutationFn: registerResidentAccount,
  });
}

export function useSignInResident() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => signInResident(email, password),
  });
}

export function useSendResidentPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => sendResidentPasswordReset(email),
  });
}
