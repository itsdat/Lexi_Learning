import { useEffect, useState } from "react";
import { generateSortingPractice } from "../../../lib/practice-ai";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface Exercise {
  id: number;
  words: string[];
  correct_order: string[];
  sentence: string;
  vietnamese: string;
}

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function SortingPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await generateSortingPractice(topic, level, count);
        setExercises(data.exercises);
        if (data.exercises.length > 0) {
          const shuffled = [...data.exercises[0].words].sort(
            () => Math.random() - 0.5,
          );
          setAvailableWords(shuffled);
        }
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
        <p className="text-lg">⏳ Đang tạo bài luyện sắp xếp...</p>
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
    userOrder.join(" ") === currentExercise.correct_order.join(" ");

  const handleAddWord = (word: string) => {
    setUserOrder([...userOrder, word]);
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (index: number) => {
    const word = userOrder[index];
    setAvailableWords([...availableWords, word]);
    setUserOrder(userOrder.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      const nextExercise = exercises[currentIndex + 1];
      const shuffled = [...nextExercise.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setCurrentIndex(currentIndex + 1);
      setUserOrder([]);
      setSubmitted(false);
    }
  };

  const handleReset = () => {
    const shuffled = [...currentExercise.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setUserOrder([]);
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Quay lại
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">📋 Sắp Xếp Từ</h2>
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
          <CardTitle>Sắp xếp các từ để tạo một câu hoàn chỉnh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Answer Area */}
          <div className="min-h-24 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">Các từ bạn đã chọn:</p>
            <div className="flex flex-wrap gap-2">
              {userOrder.length === 0 ? (
                <p className="text-gray-400 italic">
                  Chọn từ từ dưới để tạo câu...
                </p>
              ) : (
                userOrder.map((word, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleRemoveWord(idx)}
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    {word} ×
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Correct Sentence */}
          {submitted && (
            <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Câu đúng:</p>
              <p className="text-lg font-bold text-green-700">
                {currentExercise.correct_order.join(" ")}
              </p>
              <p className="text-sm text-gray-600 mt-2 italic">
                {currentExercise.vietnamese}
              </p>
            </div>
          )}

          {/* Available Words */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Chọn các từ:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableWords.map((word) => (
                <Button
                  key={word}
                  onClick={() => handleAddWord(word)}
                  disabled={submitted}
                  variant="outline"
                  className="justify-center h-12 font-medium hover:border-blue-500 hover:bg-blue-50"
                >
                  {word}
                </Button>
              ))}
            </div>
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
                <p>✅ Chính xác! Câu của bạn hoàn toàn đúng.</p>
              ) : (
                <p>❌ Chưa đúng. Thử lại hoặc xem câu đúng bên trên.</p>
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
            const prevExercise = exercises[Math.max(0, currentIndex - 1)];
            const shuffled = [...prevExercise.words].sort(
              () => Math.random() - 0.5,
            );
            setAvailableWords(shuffled);
            setUserOrder([]);
            setSubmitted(false);
          }}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          ← Trước
        </Button>

        {!submitted ? (
          <>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              🔄 Làm lại
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={userOrder.length === 0}
              className="flex-1 bg-blue-600"
            >
              Kiểm tra
            </Button>
          </>
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
