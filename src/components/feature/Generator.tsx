import { useState } from "react";
import { generateFlashcards, generateTests } from "../../lib/ai";
import { saveFlashcards, saveTests } from "../../lib/firestore";
import { useAuth } from "../../context/AuthContext";

export default function Generator() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("A1");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      setError("❌ Vui lòng nhập chủ đề");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🚀 Generating flashcards...");
      const data = await generateFlashcards(topic, level, count);

      console.log("✅ Generated:", data);

      console.log("💾 Saving to Firestore...");
      await saveFlashcards(user!.uid, topic, data);

      alert("✅ Tạo flashcards thành công!");
      setTopic("");
    } catch (err: any) {
      console.error("❌ Full error:", err);
      setError(`❌ Lỗi: ${err.message}`);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!topic.trim()) {
      setError("❌ Vui lòng nhập chủ đề");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🚀 Generating tests...");
      const data = await generateTests(topic, level, count);

      console.log("✅ Generated:", data);

      console.log("💾 Saving to Firestore...");
      await saveTests(user!.uid, topic, data);

      alert("✅ Tạo tests thành công!");
      setTopic("");
    } catch (err: any) {
      console.error("❌ Full error:", err);
      setError(`❌ Lỗi: ${err.message}`);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Tạo Bài Học</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>
      )}

      <input
        type="text"
        placeholder="Chủ đề (VD: Food, Family, Travel)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
      />

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
      >
        <option>A1</option>
        <option>A2</option>
        <option>B1</option>
        <option>B2</option>
      </select>

      <input
        type="number"
        min="5"
        max="50"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-full p-2 border mb-3 rounded"
      />

      <button
        onClick={handleGenerateFlashcards}
        disabled={loading || !topic}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2 disabled:opacity-50"
      >
        {loading ? "⏳ Đang tạo..." : "🎯 Tạo Flashcards"}
      </button>

      <button
        onClick={handleGenerateTests}
        disabled={loading || !topic}
        className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "⏳ Đang tạo..." : "✅ Tạo Tests"}
      </button>
    </div>
  );
}
