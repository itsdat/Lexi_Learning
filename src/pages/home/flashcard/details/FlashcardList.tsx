import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // thêm
import { useAuth } from "../../../../context/AuthContext";
import { getUserFlashcards } from "../../../../lib/firestore";
import BaseCardFlip from "../../../../components/common/card/BaseCardFlip";
import { Card } from "../../../../components/ui/card";
import { ChevronLeft, ChevronRight, Layers, Volume2, X } from "lucide-react";
import BaseLoading from "../../../../components/common/loading/BaseLoading";
import { Progress } from "../../../../components/ui/progress";
import { usePronunciation } from "@/hooks/usePronunciation";

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

export default function FlashcardList() {
  const { user } = useAuth();
  const { setId } = useParams<{ setId?: string }>(); // ✅ đọc setId từ URL
  const navigate = useNavigate();
  const { speak, loading: speakingLoading } = usePronunciation();

  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        const data = await getUserFlashcards(user!.uid);
        const sets = data as FlashcardSet[];
        setFlashcardSets(sets);

        // ✅ Nếu có setId trên URL → mở thẳng bộ đó, bỏ qua màn danh sách
        if (setId) {
          const found = sets.find((s) => s.id === setId);
          if (found) setSelectedSet(found);
        }
      } catch (error) {
        console.error("Error loading flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadFlashcards();
  }, [user, setId]);

  // Auto đọc từ khi đổi thẻ
  useEffect(() => {
    if (selectedSet && !isFlipped) {
      speak(selectedSet.flashcards[currentIndex].word, true);
    }
  }, [currentIndex, selectedSet]);

  // const handleBack = () => {
  //   if (setId) {
  //     navigate("/dashboard/learn");
  //   } else {
  //     // Nếu đang ở chế độ list nội bộ → bỏ chọn set
  //     setSelectedSet(null);
  //     setCurrentIndex(0);
  //     setIsFlipped(false);
  //   }
  // };

  if (loading) return <BaseLoading />;

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
      <div className="relative flex flex-col items-center justify-between h-[calc(100vh-5rem)]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <Layers strokeWidth={2.5} />
            <h1 className="text-2xl uppercase font-medium text-primary">
              {selectedSet.topic}
            </h1>
          </div>
          <button
            onClick={() => navigate("/flashcard")}
            className="cursor-pointer shadow-sm w-10 aspect-square rounded-full flex items-center justify-center bg-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div>
          <BaseCardFlip
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
            className="lg:w-lg w-xs mx-auto"
            frontContent={
              <>
                <span className="uppercase mb-5 text-zinc-400">Term</span>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl font-bold text-primary mb-4 capitalize">
                    {currentCard.word}
                  </div>
                </div>
                <div className="text-gray-500 text-center text-lg">
                  {currentCard.phonetic}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentCard.word, true);
                  }}
                  disabled={speakingLoading}
                  className="text-2xl bg-[#F4F2FD] w-12 cursor-pointer flex items-center justify-center aspect-square rounded-full mx-auto my-20 hover:scale-110 transition disabled:opacity-50"
                >
                  <Volume2 />
                </button>
                <div className="text-sm text-gray-400 mt-4 text-center">
                  (Click to flip)
                </div>
              </>
            }
            backContent={
              <>
                <span className="uppercase mb-5 text-zinc-400">Nghĩa</span>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl font-bold text-primary capitalize">
                    {currentCard.vietnamese}
                  </div>
                </div>
                <div className="flex items-center text-lg justify-center gap-2 mt-6">
                  <div className="text-gray-600 italic text-center">
                    "{currentCard.example}"
                  </div>
                </div>
                <div className="text-gray-500 text-sm mt-2 text-center">
                  {currentCard.exampleVietnamese}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentCard.example, false);
                  }}
                  disabled={speakingLoading}
                  className="text-2xl bg-[#F4F2FD] w-12 cursor-pointer flex items-center justify-center aspect-square rounded-full mx-auto my-10 hover:scale-110 transition disabled:opacity-50"
                >
                  <Volume2 />
                </button>
                <div className="text-sm text-gray-400 mt-4 text-center">
                  (Nhấn để lật)
                </div>
              </>
            }
          />

          <div className="flex gap-5 justify-center mt-10">
            <button
              onClick={() => {
                setCurrentIndex(Math.max(0, currentIndex - 1));
                setIsFlipped(false);
              }}
              disabled={currentIndex === 0}
              className="bg-white text-gray-900 w-12 flex items-center justify-center aspect-square rounded-full disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => {
                setCurrentIndex(
                  Math.min(selectedSet.flashcards.length - 1, currentIndex + 1),
                );
                setIsFlipped(false);
              }}
              disabled={currentIndex === selectedSet.flashcards.length - 1}
              className="bg-white text-gray-900 w-12 flex items-center justify-center aspect-square rounded-full disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1">
          <span>
            {currentIndex + 1} / {selectedSet.flashcards.length} cards
          </span>
          <Progress
            value={((currentIndex + 1) / selectedSet.flashcards.length) * 100}
            className="lg:w-lg w-sm bg-zinc-200 h-1.5"
          />
        </div>
      </div>
    );
  }

  // Màn danh sách (fallback khi vào /dashboard/learn không có setId)
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📚 Flashcards của tôi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcardSets.map((set) => (
          <Card
            key={set.id}
            onClick={() => {
              setSelectedSet(set);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            <h3 className="text-xl font-bold mb-2">📖 {set.topic}</h3>
            <p className="text-gray-600">{set.flashcards.length} thẻ</p>
            <p className="text-gray-400 text-sm mt-2">
              {new Date(set.createdAt?.toDate?.()).toLocaleDateString("vi-VN")}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
