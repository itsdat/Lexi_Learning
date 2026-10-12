import { useEffect, useState, useTransition } from "react";
import { BaseModal } from "@/components/common/modal/BaseModal";
import BaseSelect, {
  type BaseSelectProps,
} from "@/components/common/select/BaseSelect";
import { generateFlashcards } from "@/lib/ai";
import { saveFlashcards } from "@/lib/firestore";
import { FLASHCARD_TOPICS, type FlashcardTopic } from "@/mocks/topic-data.mock";
import { useAuth } from "@/context/AuthContext";
import type { ProficiencyLevel } from "@/lib/firestore";

const LEVEL_OPTIONS: BaseSelectProps[] = [
  { value: "A1", label: "A1 - Mới bắt đầu" },
  { value: "A2", label: "A2 - Sơ cấp" },
  { value: "B1", label: "B1 - Trung cấp" },
  { value: "B2", label: "B2 - Trung cấp cao" },
];

const TopicCardOption = ({ item }: { item: FlashcardTopic }) => {
  const Icon = item.icon;
  return (
    <div className="w-full">
      <div className="flex items-center gap-5 rounded-lg py-1 px-0.5">
        <div className="flex w-14 aspect-square items-center justify-center rounded-md bg-[#fefefe] shadow-xs">
          <Icon className="size-7 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base">{item.name}</h3>
          <p className="truncate text-xs text-gray-500">
            {item.vietnameseName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AddFlashCardModal({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, level: defaultLevel, updateLevel } = useAuth();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<ProficiencyLevel | undefined>(
    defaultLevel ?? undefined,
  );
  const [count, setCount] = useState(10);

  // Khi AuthContext load xong level đã lưu (bất đồng bộ), tự điền vào form
  useEffect(() => {
    if (defaultLevel) setLevel(defaultLevel);
  }, [defaultLevel]);

  const selectedTopic = FLASHCARD_TOPICS.find((t) => t.id === topicId);

  const handleLevelChange = (newLevel: string) => {
    const typedLevel = newLevel as ProficiencyLevel;
    setLevel(typedLevel);
    // Lưu lại làm mặc định cho lần tạo sau, khỏi phải chọn lại
    updateLevel(typedLevel).catch((err) =>
      console.error("Lỗi lưu level mặc định:", err),
    );
  };

  const handleGenerateFlashcards = () => {
    setError("");

    if (!selectedTopic) {
      setError("❌ Vui lòng chọn chủ đề");
      return;
    }
    if (!level) {
      setError("❌ Vui lòng chọn trình độ");
      return;
    }
    if (!user) {
      setError("❌ Chưa đăng nhập");
      return;
    }

    startTransition(async () => {
      try {
        console.log("🚀 Generating flashcards...");
        const data = await generateFlashcards(selectedTopic.name, level, count);

        console.log("✅ Generated:", data);
        console.log("💾 Saving to Firestore...");
        await saveFlashcards(user.uid, selectedTopic.name, data);

        onClose();
        setTopicId(undefined);
      } catch (err: any) {
        console.error("❌ Full error:", err);
        setError(`❌ Lỗi: ${err.message}`);
      }
    });
  };

  const topicOptions: BaseSelectProps[] = FLASHCARD_TOPICS.map((item) => ({
    labelDisplay: <TopicCardOption item={item} />,
    value: item.id,
    label: item.name,
  }));

  return (
    <BaseModal
      title="Create new flashcard"
      description="Choose a topic and level — AI will generate your flashcards instantly."
      open={open}
      onClose={onClose}
      submitText={isPending ? "Đang tạo..." : "Create"}
      className="max-w-xl!"
      onSubmit={handleGenerateFlashcards}
      isLoading={isPending || !topicId || !level}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">Chủ đề</label>
          <BaseSelect
            options={topicOptions}
            value={topicId}
            onValueChange={setTopicId}
            placeholder="Chọn chủ đề"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">Trình độ</label>
          <BaseSelect
            options={LEVEL_OPTIONS}
            value={level}
            onValueChange={handleLevelChange}
            placeholder="Chọn trình độ"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">
            Số lượng thẻ
          </label>
          <input
            type="number"
            min={5}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full bg-[#F8F8F8] border-0 rounded-lg h-10 px-3 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </BaseModal>
  );
}
