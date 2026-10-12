import { BaseModal } from "@/components/common/modal/BaseModal";
import BaseSelect, {
  type BaseSelectProps,
} from "@/components/common/select/BaseSelect";
import { useAuth } from "@/context/AuthContext";
import { useSaveFlashcards } from "@/hooks/useFlashcards";
import { generateFlashcards } from "@/lib/ai";
import { FLASHCARD_TOPICS, type FlashcardTopic } from "@/mocks/topic-data.mock";
import { goeyToast, gooeyToast } from "goey-toast";
import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RANDOM_TOPIC = "__random__";

const pickRandomTopic = () =>
  FLASHCARD_TOPICS[Math.floor(Math.random() * FLASHCARD_TOPICS.length)].name;

export default function AddFlashCardModal({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const { user, level: defaultLevel } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: saveFlashcardsMutate, isPending: isSaving } =
    useSaveFlashcards();

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const handleGenerateFlashcards = async () => {
    if (!defaultLevel) {
      goeyToast.warning("Chưa chọn trình độ", {
        description: "Vào Settings để chọn trình độ hiện tại.",
      });
      onClose();
      navigate("/settings");
      return;
    }

    if (!topicId) {
      goeyToast.warning("Please select a topic", {
        description: "Choose a topic before continuing.",
      });
      return;
    }

    // Chủ đề ngẫu nhiên: chọn 1 chủ đề trong danh sách
    const finalTopic = topicId === RANDOM_TOPIC ? pickRandomTopic() : topicId;

    setIsGenerating(true);

    const promise = (async () => {
      const data = await generateFlashcards(finalTopic, defaultLevel, 20);

      await saveFlashcardsMutate({
        userId: user!.uid,
        topic: finalTopic,
        data,
      });

      return data;
    })();

    gooeyToast.promise(promise, {
      loading: "Generating flashcards...",
      success: "Flashcards generated successfully!",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to generate flashcards.",
      description: {
        loading: "Please wait while AI creates your flashcards.",
        success: "Your flashcards have been saved.",
        error: "An unexpected error occurred.",
      },
      timing: {
        displayDuration: Infinity,
      },
    });

    try {
      await promise;

      onClose();
      setTopicId(undefined);
    } catch {
      // Lỗi đã được hiển thị qua toast.promise
    } finally {
      setIsGenerating(false);
    }
  };

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

  const RandomTopicOption = () => (
    <div className="w-full">
      <div className="flex items-center gap-5 rounded-lg py-1 px-0.5">
        <div className="flex w-14 aspect-square items-center justify-center rounded-md bg-[#fefefe] shadow-xs">
          <Shuffle className="size-7 stroke-[1.5]" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base">Random topic</h3>
          <p className="truncate text-xs text-gray-500">Chủ đề ngẫu nhiên</p>
        </div>
      </div>
    </div>
  );

  const topicOptions: BaseSelectProps[] = [
    {
      labelDisplay: <RandomTopicOption />,
      value: RANDOM_TOPIC,
      label: "Random topic",
    },
    ...FLASHCARD_TOPICS.map((item) => ({
      labelDisplay: <TopicCardOption item={item} />,
      value: item.name,
      label: item.name,
    })),
  ];

  return (
    <>
      <BaseModal
        title="Create new flashcard"
        description="Choose a topic and level — AI will generate your flashcards instantly."
        open={open}
        onClose={onClose}
        submitText="Create"
        className="max-w-xl!"
        onSubmit={handleGenerateFlashcards}
        isLoading={isGenerating || isSaving}
      >
        <BaseSelect
          options={topicOptions}
          value={topicId}
          onValueChange={setTopicId}
          placeholder="Chọn chủ đề học"
        />
        <p className="mt-2 text-xs text-gray-500">
          Trình độ: {defaultLevel ?? "chưa chọn"} (đổi trong Settings)
        </p>
      </BaseModal>
    </>
  );
}