import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const saveFlashcards = async (userId: string, topic: string, data: any) => {
  const docRef = await addDoc(collection(db, "flashcards"), {
    userId,
    topic,
    flashcards: data.flashcards,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getUserFlashcards = async (userId: string) => {
  const q = query(collection(db, "flashcards"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const saveTests = async (userId: string, topic: string, data: any) => {
  const docRef = await addDoc(collection(db, "tests"), {
    userId,
    topic,
    tests: data.tests,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getUserTests = async (userId: string) => {
  const q = query(collection(db, "tests"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};