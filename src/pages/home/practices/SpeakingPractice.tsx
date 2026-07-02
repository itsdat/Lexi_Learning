import { useEffect, useState } from "react";
import { generateSpeakingPractice } from "../../../lib/practice-ai";
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
  text: string;
  phonetic: string;
  vietnamese: string;
  difficulty: string;
}

interface Props {
  topic: string;
  level: string;
  count: number;
  onBack: () => void;
}

export default function SpeakingPractice({
  topic,
  level,
  count,
  onBack,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await generateSpeakingPractice(topic, level, count);
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
        <p className="text-lg">⏳ Đang tạo bài luyện nói...</p>
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

  const handlePlay = () => {
    setIsPlaying(true);
    speak(currentExercise.text, "en-US");
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Quay lại
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">🎤 Luyện Nói</h2>
        <p className="text-gray-600 mt-2">
          Chủ đề: {topic} | Mức độ: {level}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Câu {currentIndex + 1} / {exercises.length}
        </p>
      </div>

      {/* Exercise Card */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">
            {currentExercise.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phonetic */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Phát âm:</p>
            <p className="text-lg font-mono text-gray-800">
              {currentExercise.phonetic}
            </p>
          </div>

          {/* Vietnamese */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Tiếng Việt:</p>
            <p className="text-lg text-green-700">
              {currentExercise.vietnamese}
            </p>
          </div>

          {/* Play Button */}
          <Button
            onClick={handlePlay}
            disabled={isPlaying}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? "🔊 Đang phát..." : "▶️ Nghe mẫu"}
          </Button>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              📋 Hướng dẫn: Nhấn nút "Nghe mẫu" để nghe cách phát âm, sau đó bạn
              hãy nói theo!
            </p>
          </div>

          {/* Recording would go here - requires Web Speech API */}
          <Button variant="outline" size="lg" className="w-full">
            🎙️ Bắt đầu ghi âm (Soon...)
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          ← Trước
        </Button>

        <Button
          onClick={() =>
            setCurrentIndex(Math.min(exercises.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === exercises.length - 1}
          className="flex-1"
        >
          Tiếp →
        </Button>
      </div>
    </div>
  );
}
