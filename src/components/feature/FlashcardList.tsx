import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserFlashcards } from "../../lib/firestore";
import BaseCardFlip from "../common/card/BaseCardFlip";

interface Flashcard {
  word: string;
  phonetic: string;
  vietnamese: string;
  example: string;
  exampleVietnamese: string;
}

interface FlashcardSet {
  id: string;
  topic: string;
  flashcards: Flashcard[];
  createdAt: any;
}

// Cache audio url đã fetch để không gọi API lại nhiều lần
const audioCache = new Map<string, string | null>();

const fetchAudioUrl = async (word: string): Promise<string | null> => {
  if (audioCache.has(word)) return audioCache.get(word)!;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
    );
    if (!res.ok) throw new Error("not found");
    const data = await res.json();

    // Tìm phonetic có audio (ưu tiên cái có file mp3)
    let url: string | null = null;
    for (const entry of data) {
      for (const p of entry.phonetics || []) {
        if (p.audio) {
          url = p.audio.startsWith("http") ? p.audio : `https:${p.audio}`;
          break;
        }
      }
      if (url) break;
    }

    audioCache.set(word, url);
    return url;
  } catch {
    audioCache.set(word, null);
    return null;
  }
};

const speakFallback = (text: string) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

// Hàm chính: thử audio thật trước, không có thì fallback TTS
const playPronunciation = async (text: string, isWordOnly: boolean) => {
  if (isWordOnly) {
    const url = await fetchAudioUrl(text);
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(() => speakFallback(text));
      return;
    }
  }
  speakFallback(text);
};

export default function FlashcardList() {
  const { user } = useAuth();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingLoading, setSpeakingLoading] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        const data = await getUserFlashcards(user!.uid);
        setFlashcardSets(data as any);
      } catch (error) {
        console.error("Error loading flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFlashcards();
    }
  }, [user]);

  // Tự đọc từ mới mỗi khi đổi thẻ (mặt trước)
  useEffect(() => {
    if (selectedSet && !isFlipped) {
      playPronunciation(selectedSet.flashcards[currentIndex].word, true);
    }
  }, [currentIndex, selectedSet]);

  const handleSpeak = async (text: string, isWordOnly: boolean) => {
    setSpeakingLoading(true);
    await playPronunciation(text, isWordOnly);
    setSpeakingLoading(false);
  };

  if (loading) return <div className="text-center p-6">⏳ Đang tải...</div>;

  if (flashcardSets.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">Chưa có flashcards nào. Hãy tạo mới!</p>
      </div>
    );
  }

  if (selectedSet) {
    const currentCard = selectedSet.flashcards[currentIndex];

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={() => {
            setSelectedSet(null);
            setCurrentIndex(0);
          }}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Quay lại
        </button>

        <h2 className="text-2xl font-bold mb-4">📖 {selectedSet.topic}</h2>

        <div className="mb-4 text-gray-600">
          Thẻ {currentIndex + 1} / {selectedSet.flashcards.length}
        </div>

        <BaseCardFlip
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
          frontContent={
            <>
              <div className="flex items-center justify-center gap-3">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  {currentCard.word}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word, true);
                  }}
                  disabled={speakingLoading}
                  className="text-2xl mb-4 hover:scale-110 transition disabled:opacity-50"
                  title="Nghe phát âm chuẩn"
                >
                  🔊
                </button>
              </div>
              <div className="text-gray-500">{currentCard.phonetic}</div>
              <div className="text-sm text-gray-400 mt-4">(Click để lật)</div>
            </>
          }
          backContent={
            <>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {currentCard.vietnamese}
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="text-gray-600 italic">
                  "{currentCard.example}"
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.example, false);
                  }}
                  className="text-xl hover:scale-110 transition"
                  title="Nghe câu ví dụ (giọng máy)"
                >
                  🔊
                </button>
              </div>
              <div className="text-gray-500 text-sm mt-2">
                {currentCard.exampleVietnamese}
              </div>
            </>
          }
        />

        {/* Controls */}
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => {
              setCurrentIndex(Math.max(0, currentIndex - 1));
              setIsFlipped(false);
            }}
            disabled={currentIndex === 0}
            className="bg-gray-400 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            ← Trước
          </button>

          <button
            onClick={() => {
              setCurrentIndex(
                Math.min(selectedSet.flashcards.length - 1, currentIndex + 1),
              );
              setIsFlipped(false);
            }}
            disabled={currentIndex === selectedSet.flashcards.length - 1}
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            Tiếp →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📚 Flashcards của tôi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcardSets.map((set) => (
          <div
            key={set.id}
            onClick={() => {
              setSelectedSet(set);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">📖 {set.topic}</h3>
            <p className="text-gray-600">{set.flashcards.length} thẻ</p>
            <p className="text-gray-400 text-sm mt-2">
              {new Date(set.createdAt?.toDate?.()).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}