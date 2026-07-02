import { useState } from "react";
import SpeakingPractice from "./SpeakingPractice";
import ListeningPractice from "./ListeningPractice";
import WritingPractice from "./WritingPractice";
import DictationPractice from "./DictationPractice";
import MultipleChoicePractice from "./MultipleChoicePractice";
import MatchingPractice from "./MatchingPractice";
import SortingPractice from "./SortingPractice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type PracticeType =
  | "speaking"
  | "listening"
  | "writing"
  | "dictation"
  | "multiple-choice"
  | "matching"
  | "sorting"
  | null;

const practiceTypes = [
  {
    id: "speaking",
    icon: "🎤",
    label: "Luyện Nói",
    description: "Phát âm từ vựng và câu",
  },
  {
    id: "listening",
    icon: "👂",
    label: "Luyện Nghe",
    description: "Nghe và trả lời câu hỏi",
  },
  {
    id: "writing",
    icon: "✍️",
    label: "Luyện Viết",
    description: "Điền từ vào chỗ trống",
  },
  {
    id: "dictation",
    icon: "📝",
    label: "Chính Tả",
    description: "Nghe và viết lại câu",
  },
  {
    id: "multiple-choice",
    icon: "☑️",
    label: "Trắc Nghiệm",
    description: "Chọn đáp án đúng",
  },
  {
    id: "matching",
    icon: "🔗",
    label: "Nối Câu",
    description: "Nối câu hỏi với câu trả lời",
  },
  {
    id: "sorting",
    icon: "📋",
    label: "Sắp Xếp",
    description: "Sắp xếp từ tạo câu đúng",
  },
];

export default function PracticeMenu() {
  const [selectedType, setSelectedType] = useState<PracticeType>(null);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("A1");
  const [count, setCount] = useState(5);

  if (selectedType === "speaking") {
    return (
      <SpeakingPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "listening") {
    return (
      <ListeningPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "writing") {
    return (
      <WritingPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "dictation") {
    return (
      <DictationPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "multiple-choice") {
    return (
      <MultipleChoicePractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "matching") {
    return (
      <MatchingPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  if (selectedType === "sorting") {
    return (
      <SortingPractice
        topic={topic}
        level={level}
        count={count}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Cấu hình bài luyện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chủ đề</label>
            <Input
              placeholder="VD: Food, Travel, Business..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mức độ</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 - Sơ cấp</SelectItem>
                  <SelectItem value="A2">A2 - Sơ cấp trên</SelectItem>
                  <SelectItem value="B1">B1 - Trung cấp</SelectItem>
                  <SelectItem value="B2">B2 - Trung cấp trên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số câu ({count})</label>
              <Input
                type="range"
                min="3"
                max="20"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Types */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Chọn kiểu luyện tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceTypes.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition hover:border-blue-500"
              onClick={() => {
                if (!topic.trim()) {
                  alert("Vui lòng nhập chủ đề!");
                  return;
                }
                setSelectedType(type.id as PracticeType);
              }}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{type.icon}</div>
                <CardTitle className="text-lg">{type.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
