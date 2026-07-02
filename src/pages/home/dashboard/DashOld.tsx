import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Generator from "@/components/feature/Generator";
import FlashcardList from "@/components/feature/FlashcardList";
import TestList from "@/components/feature/TestList";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"home" | "create" | "learn" | "test">("home");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="text-center p-6">⏳ Đang tải...</div>;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📚</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="flex gap-2 border-b bg-white p-4 max-w-6xl mx-auto">
        <button
          onClick={() => setTab("home")}
          className={`px-4 py-2 rounded ${
            tab === "home"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          🏠 Trang chủ
        </button>
        <button
          onClick={() => setTab("create")}
          className={`px-4 py-2 rounded ${
            tab === "create"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ➕ Tạo bài
        </button>
        <button
          onClick={() => setTab("learn")}
          className={`px-4 py-2 rounded ${
            tab === "learn"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          📖 Học
        </button>
        <button
          onClick={() => setTab("test")}
          className={`px-4 py-2 rounded ${
            tab === "test"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ✅ Test
        </button>
      </div>

      <div className="p-6">
        {tab === "home" && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => setTab("create")}
              >
                <h2 className="text-2xl mb-2">🎯 Tạo Bài Học</h2>
                <p className="text-gray-600">
                  Tạo flashcards, tests, từ vựng mới
                </p>
              </div>

              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => setTab("learn")}
              >
                <h2 className="text-2xl mb-2">📖 Học Flashcards</h2>
                <p className="text-gray-600">Ôn luyện flashcards của bạn</p>
              </div>

              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => setTab("test")}
              >
                <h2 className="text-2xl mb-2">✅ Làm Tests</h2>
                <p className="text-gray-600">Kiểm tra kiến thức của bạn</p>
              </div>
            </div>
          </div>
        )}

        {tab === "create" && <Generator />}
        {tab === "learn" && <FlashcardList />}
        {tab === "test" && <TestList />}
      </div>
    </div>
  );
}
