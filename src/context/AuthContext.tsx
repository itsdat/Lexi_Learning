import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getUserProfile,
  setUserLevel as setUserLevelInFirestore,
  type ProficiencyLevel,
} from "../lib/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  level: ProficiencyLevel | null;
  levelLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLevel: (level: ProficiencyLevel) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [level, setLevel] = useState<ProficiencyLevel | null>(null);
  const [levelLoading, setLevelLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        setLevel(null);
        setLevelLoading(false);
        return;
      }

      // Tự load level đã lưu ngay khi biết user đã đăng nhập,
      // để các trang khác (tạo flashcard, v.v.) dùng ngay không cần chọn lại
      try {
        setLevelLoading(true);
        const profile = await getUserProfile(currentUser.uid);
        setLevel(profile?.level ?? null);
      } catch (err) {
        console.error("Lỗi load user profile:", err);
        setLevel(null);
      } finally {
        setLevelLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateLevel = async (newLevel: ProficiencyLevel) => {
    if (!user) throw new Error("Chưa đăng nhập");
    await setUserLevelInFirestore(user.uid, newLevel);
    setLevel(newLevel); // cập nhật ngay trong state, khỏi phải fetch lại
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        level,
        levelLoading,
        signup,
        login,
        logout,
        updateLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}