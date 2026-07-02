import { useEffect, useState } from "react";
import { generateWritingPractice } from "../../../lib/practice-ai";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

interface Exercise {
  id: number;
  sentence: string;
  answer: string;
  options: string[];
  vietnamese: string;
  type: string;
}

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function WritingPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await generateWritingPractice(topic, level, count);
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
        <p className="text-lg">⏳ Đang tạo bài luyện viết...</p>
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
    userAnswer.toLowerCase().trim() === currentExercise.answer.toLowerCase();

  const handleSubmit = () => {
    setSubmitted(true);
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Quay lại
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">✍️ Luyện Viết</h2>
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

      {/* Exercise Card */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle>Điền từ vào chỗ trống</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sentence with blank */}
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-lg font-medium text-gray-800">
              {currentExercise.sentence.split("_____").map((part, idx) => (
                <span key={idx}>
                  {part}
                  {idx === 0 && (
                    <span className="bg-blue-200 px-8 py-2 mx-2 rounded">
                      ?
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>

          {/* Vietnamese */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Tiếng Việt:</p>
            <p className="text-gray-800">{currentExercise.vietnamese}</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Chọn từ gợi ý:</p>
            <div className="grid grid-cols-2 gap-2">
              {currentExercise.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => setUserAnswer(option)}
                  variant={userAnswer === option ? "default" : "outline"}
                  className="justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hoặc gõ trực tiếp:</label>
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Gõ từ ở đây..."
              disabled={submitted}
              onKeyPress={(e) =>
                e.key === "Enter" && !submitted && handleSubmit()
              }
            />
          </div>

          {/* Feedback */}
          {submitted && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-100 border border-green-500 text-green-700"
                  : "bg-red-100 border border-red-500 text-red-700"
              }`}
            >
              {isCorrect ? (
                <p>
                  ✅ Chính xác! Đáp án là:{" "}
                  <strong>{currentExercise.answer}</strong>
                </p>
              ) : (
                <p>
                  ❌ Sai! Đáp án đúng là:{" "}
                  <strong>{currentExercise.answer}</strong>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1));
            setUserAnswer("");
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
            disabled={!userAnswer.trim()}
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
