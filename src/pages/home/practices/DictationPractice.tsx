// src/components/practice/DictationPractice.tsx
import { useEffect, useState } from "react";
import { generateDictationPractice } from "../../../lib/practice-ai";
import { speak } from "../../../lib/tts";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface Exercise {
  id: number;
  sentence: string;
  vietnamese: string;
  difficulty: string;
  word_count: number;
}

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function DictationPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userText, setUserText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await generateDictationPractice(topic, level, count);
        setExercises(data.exercises);
      } catch (error) {
        console.error("Error:", error);
        alert("Lỗi tải bài luyện");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [topic, level, count]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-lg">⏳ Đang tạo bài chính tả...</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Lỗi tải bài luyện</p>
        <Button onClick={onBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const isCorrect =
    userText.toLowerCase().trim() === currentExercise.sentence.toLowerCase();

  const handlePlayAudio = () => {
    setIsPlaying(true);
    speak(currentExercise.sentence, "en-US");
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserText("");
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Quay lại
      </Button>

      <div>
        <h2 className="text-3xl font-bold">📝 Chính Tả</h2>
        <p className="text-gray-600 mt-2">
          Chủ đề: {topic} | Mức độ: {level}
        </p>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>
            Câu {currentIndex + 1} / {exercises.length}
          </span>
          <span>✅ Đúng: {correctCount}</span>
        </div>
      </div>

      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle>Nghe và viết lại câu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handlePlayAudio}
            disabled={isPlaying || submitted}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 h-16"
          >
            {isPlaying ? "🔊 Đang phát..." : "▶️ Nghe câu"}
          </Button>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Tiếng Việt:</p>
            <p className="text-gray-800">{currentExercise.vietnamese}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Viết lại câu bạn nghe:
            </label>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Gõ câu bạn nghe vào đây..."
              disabled={submitted}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 resize-none h-24"
            />
          </div>

          {submitted && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-100 border border-green-500 text-green-700"
                  : "bg-red-100 border border-red-500 text-red-700"
              }`}
            >
              {isCorrect ? (
                <p>✅ Chính xác!</p>
              ) : (
                <div>
                  <p>❌ Sai! Câu đúng là:</p>
                  <p className="font-bold mt-2">{currentExercise.sentence}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1));
            setUserText("");
            setSubmitted(false);
          }}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          ← Trước
        </Button>

        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!userText.trim()}
            className="flex-1 bg-blue-600"
          >
            Kiểm tra
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentIndex === exercises.length - 1}
            className="flex-1 bg-green-600"
          >
            Tiếp →
          </Button>
        )}
      </div>
    </div>
  );
}
