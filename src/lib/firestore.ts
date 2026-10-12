import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
  setDoc,
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

// ---- User profile (lưu level mặc định để khỏi chọn lại mỗi lần tạo flashcard) ----
 
export type ProficiencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
 
export interface UserProfile {
  level: ProficiencyLevel;
  updatedAt: Timestamp;
}
 
// Dùng doc ID = userId (thay vì query where) để đọc/ghi nhanh, không cần index
export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};
 
export const setUserLevel = async (
  userId: string,
  level: ProficiencyLevel,
) => {
  const ref = doc(db, "users", userId);
  // merge: true để không ghi đè mất các field khác nếu sau này profile có thêm field
  await setDoc(
    ref,
    { level, updatedAt: Timestamp.now() },
    { merge: true },
  );
};