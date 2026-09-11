import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBfErgH1on_YGrZ8oIzKfud_xpIvKi7QM8",
  authDomain: "barangay-information-sys-c37c4.firebaseapp.com",
  projectId: "barangay-information-sys-c37c4",
  storageBucket: "barangay-information-sys-c37c4.firebasestorage.app",
  messagingSenderId: "286924607978",
  appId: "1:286924607978:web:dbff623022e886487ae293",
});

const db = getFirestore(app);
const now = "2026-09-11";
const address = "Bonbon, Clarin, Bohol";
const usersRef = collection(db, "users");
const digitsForDocumentId = "0123456789";

const users = [
  {
    first_name: "Maria",
    last_name: "Santos",
    middle_name: "Reyes",
    date_of_birth: "March 12, 1998",
    suffix: "",
    age: 28,
    civil_status: "Single",
    sex: "Female",
    purok: "Purok 2",
    contact_number: "0917 555 2101",
    email: "maria.santos@example.com",
  },
  {
    first_name: "Jose",
    last_name: "Ramirez",
    middle_name: "Cruz",
    date_of_birth: "July 3, 2007",
    suffix: "",
    age: 19,
    civil_status: "Single",
    sex: "Male",
    purok: "Purok 4",
    contact_number: "0918 442 1188",
    email: "jose.ramirez@example.com",
  },
  {
    first_name: "Ana",
    last_name: "Villanueva",
    middle_name: "Lopez",
    date_of_birth: "November 21, 1984",
    suffix: "",
    age: 41,
    civil_status: "Married",
    sex: "Female",
    purok: "Purok 1",
    contact_number: "0922 300 7745",
    email: "ana.villanueva@example.com",
  },
  {
    first_name: "Carlo",
    last_name: "Mendoza",
    middle_name: "Diaz",
    date_of_birth: "January 8, 1991",
    suffix: "Jr",
    age: 35,
    civil_status: "Married",
    sex: "Male",
    purok: "Purok 5",
    contact_number: "0916 889 3340",
    email: "carlo.mendoza@example.com",
  },
  {
    first_name: "Liza",
    last_name: "Navarro",
    middle_name: "Bautista",
    date_of_birth: "May 16, 2004",
    suffix: "",
    age: 22,
    civil_status: "Single",
    sex: "Female",
    purok: "Purok 3",
    contact_number: "0908 221 6672",
    email: "liza.navarro@example.com",
  },
  {
    first_name: "Pedro",
    last_name: "Gomez",
    middle_name: "Santos",
    date_of_birth: "August 2, 1990",
    suffix: "",
    age: 36,
    civil_status: "Married",
    sex: "Male",
    purok: "Purok 6",
    contact_number: "0915 220 1180",
    email: "pedro.gomez@example.com",
  },
  {
    first_name: "Rosa",
    last_name: "Tan",
    middle_name: "Flores",
    date_of_birth: "February 19, 1978",
    suffix: "",
    age: 48,
    civil_status: "Widowed",
    sex: "Female",
    purok: "Purok 7",
    contact_number: "0906 774 3312",
    email: "rosa.tan@example.com",
  },
];

function createSixDigitDocumentId() {
  return Array.from({ length: 6 }, () => digitsForDocumentId[Math.floor(Math.random() * digitsForDocumentId.length)]).join("");
}

async function nextUserDocRef() {
  for (;;) {
    const userRef = doc(usersRef, createSixDigitDocumentId());

    if (!(await getDoc(userRef)).exists()) {
      return userRef;
    }
  }
}

async function nextResidentId() {
  const snapshot = await getDocs(usersRef);

  return snapshot.docs.reduce((max, entry) => Math.max(max, Number(entry.data().id) || 0), 0) + 1;
}

for (const user of users) {
  const existing = await getDocs(query(usersRef, where("email", "==", user.email)));

  if (!existing.empty) {
    console.log(`Skipped ${user.email}, already exists`);
    continue;
  }

  const userRef = await nextUserDocRef();
  const id = await nextResidentId();

  await setDoc(userRef, {
    id,
    role: 1,
    ...user,
    permanent_address: address,
    status: "pending",
    decline_reason: "",
    create_date: now,
    update_date: now,
  });

  console.log(`Added id ${id} as ${userRef.id}`);
}

console.log("Done seeding users.");
