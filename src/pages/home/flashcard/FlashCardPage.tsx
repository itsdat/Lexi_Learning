import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Plus, ArrowUpDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLASHCARD_TOPICS, getCategories } from "@/mocks/topic-data.mock";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AddFlashCardModal from "./modal/AddFlashCardModal";
import { useGetAllFlashcards } from "@/hooks/useFlashcards";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "most-cards", label: "Nhiều thẻ nhất" },
  { value: "az", label: "A → Z" },
];

// Fake progress per set (thay bằng data thật nếu cậu lưu progress trong Firestore)
const getFakeProgress = (id: string) => {
  const map: Record<string, number> = {};
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return map[id] ?? Math.floor((hash % 5) * 25);
};

export default function FlashcardCollection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [sort, setSort] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const [openAddCard, setOpenAddCard] = useState<boolean>(false);

  const categories = ["Tất cả", ...getCategories()];

  const { data, isLoading } = useGetAllFlashcards(user?.uid);
  const flashcardSets = data ?? [];

  const filtered = useMemo(() => {
    let result = [...(flashcardSets as any)];

    if (activeCategory !== "Tất cả") {
      result = result.filter((s) => {
        const topic = FLASHCARD_TOPICS.find(
          (t) =>
            t.name === s.topic ||
            t.vietnameseName === s.topic ||
            t.id === s.topic,
        );
        return topic?.category === activeCategory;
      });
    }

    switch (sort) {
      case "oldest":
        result.sort(
          (a, b) => a.createdAt?.toDate?.() - b.createdAt?.toDate?.(),
        );
        break;
      case "most-cards":
        result.sort((a, b) => b.flashcards.length - a.flashcards.length);
        break;
      case "az":
        result.sort((a, b) => a.topic.localeCompare(b.topic));
        break;
      default: // newest
        result.sort(
          (a, b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.(),
        );
    }

    return result;
  }, [data, activeCategory, sort]);

  const getTopicMeta = (topicStr: string) => {
    return (
      FLASHCARD_TOPICS.find(
        (t) =>
          t.name === topicStr ||
          t.vietnameseName === topicStr ||
          t.id === topicStr,
      ) ?? null
    );
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bộ sưu tập Flashcard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý và ôn tập từ vựng của bạn một cách hiệu quả.
            </p>
          </div>
          <Button
            onClick={() => setOpenAddCard(true)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus size={16} />
            Tạo Flashcard mới
          </Button>
        </div>

        {/* Filter + Sort bar */}
        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border border-gray-900"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative w-fit">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:border-gray-400 transition"
            >
              <ArrowUpDown size={14} />
              Sắp xếp theo:
              <span className="font-medium text-gray-900">
                {SORT_OPTIONS.find((s) => s.value === sort)?.label}
              </span>
            </button>
            {showSort && (
              <div className="absolute right-0 top-9 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-44">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setShowSort(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                      sort === opt.value
                        ? "font-medium text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse h-44"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen size={48} className="text-gray-300 mb-2 stroke-[1.5]" />
            <p className="text-gray-500 text-lg font-medium">
              Chưa có flashcard nào
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Hãy tạo bộ flashcard đầu tiên của bạn!
            </p>
            <Button
              onClick={() => navigate("/flashcard/create")}
              className="mt-4 bg-gray-900 text-white rounded-lg px-5 py-2 text-sm"
            >
              Tạo ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((set) => {
              const meta = getTopicMeta(set.topic);
              const progress = getFakeProgress(set.id);

              return (
                <Card
                  key={set.id}
                  onClick={() => navigate(`/flashcard/learn/${set.id}`)}
                  className="group cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                        {meta?.icon ? (
                          <meta.icon className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>
                      <Badge>{meta?.category ?? "General"}</Badge>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                      {set.topic}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {meta
                        ? `Từ vựng chuyên ngành ${meta.vietnameseName.toLowerCase()} cho các buổi học và ôn luyện.`
                        : "Bộ flashcard tùy chỉnh của bạn."}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                      <span>{set.flashcards.length} thẻ</span>
                      <span className="font-medium text-gray-600">
                        {progress}% hoàn thành
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddFlashCardModal
        open={openAddCard}
        onClose={() => setOpenAddCard(false)}
      />
    </>
  );
}
