import { useEffect, useState } from "react";
import { generateListeningPractice } from "../../../lib/practice-ai";
import { speak } from "../../../lib/tts";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { usePronunciation } from "@/hooks/usePronunciation";

interface Exercise {
  id: number;
  audio_text: string;
  question: string;
  options: string[];
  correct_answer: number;
  vietnamese_question: string;
}

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function ListeningPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const { speak, loading: speakingLoading } = usePronunciation();

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await generateListeningPractice(topic, level, count);
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
        <p className="text-lg">⏳ Đang tạo bài luyện nghe...</p>
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
  const isCorrect = selectedAnswer === currentExercise.correct_answer;

  const handlePlayAudio = () => {
    speak(currentExercise.audio_text);
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
      setSelectedAnswer(null);
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
        <h2 className="text-3xl font-bold">👂 Luyện Nghe</h2>
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
          <CardTitle>Nghe và trả lời câu hỏi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Play Audio Button */}
          <Button
            onClick={handlePlayAudio}
            disabled={speakingLoading || submitted}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 h-16"
          >
            {speakingLoading ? "🔊 Đang phát..." : "▶️ Nghe đoạn âm thanh"}
          </Button>

          {/* Question */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Câu hỏi:</p>
            <p className="text-lg font-medium text-gray-800">
              {currentExercise.question}
            </p>
            <p className="text-sm text-gray-600 mt-2 italic">
              {currentExercise.vietnamese_question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            {currentExercise.options.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                disabled={submitted}
                variant={selectedAnswer === idx ? "default" : "outline"}
                className="w-full justify-start h-12 text-base"
              >
                <span className="mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </Button>
            ))}
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
                <p>✅ Chính xác!</p>
              ) : (
                <p>
                  ❌ Sai! Đáp án đúng là:{" "}
                  <strong>
                    {currentExercise.options[currentExercise.correct_answer]}
                  </strong>
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
            setSelectedAnswer(null);
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
            disabled={selectedAnswer === null}
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
