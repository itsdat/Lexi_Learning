import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserTests } from "../../lib/firestore";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // index của đáp án đúng trong options
  explanation?: string;
}

interface TestSet {
  id: string;
  topic: string;
  tests: Question[];
  createdAt: any;
}

export default function TestList() {
  const { user } = useAuth();
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<TestSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true);
        const data = await getUserTests(user!.uid);
        setTestSets(data as any);
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTests();
    }
  }, [user]);

  const startTest = (set: TestSet) => {
    setSelectedSet(set);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(set.tests.length).fill(null));
    setShowResult(false);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // đã chọn rồi thì không cho đổi
    setSelectedAnswer(optionIndex);

    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!selectedSet) return;

    if (currentIndex < selectedSet.tests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(answers[currentIndex + 1]);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
    }
  };

  const calculateScore = () => {
    if (!selectedSet) return 0;
    let correct = 0;
    selectedSet.tests.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const resetTest = () => {
    setSelectedSet(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
  };

  if (loading) return <div className="text-center p-6">⏳ Đang tải...</div>;

  if (testSets.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">Chưa có bài test nào. Hãy tạo mới!</p>
      </div>
    );
  }

  // Màn hình kết quả
  if (selectedSet && showResult) {
    const score = calculateScore();
    const total = selectedSet.tests.length;
    const percent = Math.round((score / total) * 100);

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 Kết quả</h2>
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {score}/{total}
          </div>
          <div className="text-gray-500 mb-6">{percent}% chính xác</div>

          <div className="space-y-3 text-left mb-6">
            {selectedSet.tests.map((q, i) => {
              const isCorrect = answers[i] === q.correctAnswer;
              return (
                <div
                  key={i}
                  className={`p-3 rounded border ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <p className="font-medium">
                    {isCorrect ? "✅" : "❌"} {q.question}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      Đáp án đúng: {q.options[q.correctAnswer]}
                    </p>
                  )}
                  {q.explanation && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => startTest(selectedSet)}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              🔄 Làm lại
            </button>
            <button
              onClick={resetTest}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình làm test
  if (selectedSet) {
    const currentQuestion = selectedSet.tests[currentIndex];

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={resetTest}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Quay lại
        </button>

        <h2 className="text-2xl font-bold mb-2">✅ {selectedSet.topic}</h2>
        <div className="mb-4 text-gray-600">
          Câu {currentIndex + 1} / {selectedSet.tests.length}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / selectedSet.tests.length) * 100}%`,
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-xl font-medium mb-6">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = i === currentQuestion.correctAnswer;
              const showFeedback = selectedAnswer !== null;

              let style = "border-gray-200 hover:border-blue-300";
              if (showFeedback) {
                if (isCorrectAnswer) {
                  style = "border-green-400 bg-green-50";
                } else if (isSelected) {
                  style = "border-red-400 bg-red-50";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 border-2 rounded-lg transition ${style} ${
                    selectedAnswer === null
                      ? "cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  {option}
                  {showFeedback && isCorrectAnswer && " ✅"}
                  {showFeedback && isSelected && !isCorrectAnswer && " ❌"}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && currentQuestion.explanation && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
              💡 {currentQuestion.explanation}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-gray-400 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            ← Trước
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {currentIndex === selectedSet.tests.length - 1
              ? "Xem kết quả"
              : "Tiếp →"}
          </button>
        </div>
      </div>
    );
  }

  // Màn hình danh sách test
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">✅ Tests của tôi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testSets.map((set) => (
          <div
            key={set.id}
            onClick={() => startTest(set)}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">✅ {set.topic}</h3>
            <p className="text-gray-600">{set.tests.length} câu hỏi</p>
            <p className="text-gray-400 text-sm mt-2">
              {new Date(set.createdAt?.toDate?.()).toLocaleDateString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
