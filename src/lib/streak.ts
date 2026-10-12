import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Lấy ngày hiện tại dạng YYYY-MM-DD theo local timezone (tránh lệch giờ UTC)
const getTodayString = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
};

// Tính số ngày chênh lệch giữa 2 ngày dạng YYYY-MM-DD
const daysDiff = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const checkin = async (userId: string) => {
  const today = getTodayString();
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const data = userSnap.exists() ? userSnap.data() : {};
  const lastDate: string | undefined = data.lastCheckinDate;
  const currentStreak: number = data.currentStreak || 0;
  const longestStreak: number = data.longestStreak || 0;
  const checkinHistory: string[] = data.checkinHistory || [];

  // Đã check-in hôm nay rồi thì không làm gì
  if (lastDate === today) {
    return { alreadyCheckedIn: true, currentStreak };
  }

  let newStreak: number;

  if (!lastDate) {
    // Lần đầu check-in
    newStreak = 1;
  } else {
    const diff = daysDiff(lastDate, today);
    if (diff === 1) {
      // Check-in hôm qua → hôm nay liên tiếp, tăng streak
      newStreak = currentStreak + 1;
    } else if (diff > 1) {
      // Bỏ lỡ ít nhất 1 ngày → reset streak về 1
      newStreak = 1;
    } else {
      // diff <= 0, trường hợp lạ (đổi giờ máy...) → giữ nguyên an toàn
      newStreak = currentStreak;
    }
  }

  const newLongest = Math.max(longestStreak, newStreak);
  const newHistory = [...checkinHistory, today].slice(-365); // giữ tối đa 365 ngày gần nhất

  await setDoc(
    userRef,
    {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCheckinDate: today,
      checkinHistory: newHistory,
    },
    { merge: true },
  );

  return { alreadyCheckedIn: false, currentStreak: newStreak, isNewRecord: newStreak === newLongest && newStreak > 1 };
};

export const getStreakInfo = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { currentStreak: 0, longestStreak: 0, lastCheckinDate: null, checkinHistory: [] };
  }

  const data = userSnap.data();
  const today = getTodayString();
  let currentStreak = data.currentStreak || 0;

  // Nếu lastCheckinDate cách hôm nay > 1 ngày → streak đã bị đứt, hiển thị về 0
  if (data.lastCheckinDate) {
    const diff = daysDiff(data.lastCheckinDate, today);
    if (diff > 1) {
      currentStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak: data.longestStreak || 0,
    lastCheckinDate: data.lastCheckinDate || null,
    checkinHistory: data.checkinHistory || [],
    checkedInToday: data.lastCheckinDate === today,
  };
};