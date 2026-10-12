import { useState } from "react";
import { Link } from "react-router-dom";
import { gooeyToast } from "goey-toast";
import { useAuth } from "@/context/AuthContext";
import { saveLevelTestResult, type ProficiencyLevel } from "@/lib/firestore";
import { generateLevelTest, type LevelTestQuestion } from "@/lib/level-test";
import { getNextLevel, LEVEL_TEST_COUNT, PASS_RATE } from "@/lib/levels";

type Phase = "intro" | "loading" | "testing" | "result";

export default function LevelTest() {
  const { user, level, levelLoading, updateLevel } = useAuth();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [testedLevel, setTestedLevel] = useState<ProficiencyLevel | null>(null);

  const nextLevel = level ? getNextLevel(level) : null;
  const needed = Math.ceil(LEVEL_TEST_COUNT * PASS_RATE);

  const score = questions.reduce(
    (s, q, i) => (answers[i] === q.correct_answer ? s + 1 : s),
    0,
  );
  const passed =
    questions.length > 0 && score / questions.length >= PASS_RATE;

  const start = async () => {
    if (!nextLevel) return;
    setPhase("loading");
    try {
      const qs = await generateLevelTest(nextLevel, LEVEL_TEST_COUNT);
      setTestedLevel(nextLevel);
      setQuestions(qs);
      setAnswers({});
      setCurrent(0);
      setPhase("testing");
    } catch (err) {
      gooeyToast.error("Không tạo được bài kiểm tra", {
        description: err instanceof Error ? err.message : "Thử lại sau.",
      });
      setPhase("intro");
    }
  };

  const submit = async () => {
    if (!user || !level || !testedLevel) return;
    setSubmitting(true);
    try {
      await saveLevelTestResult(user.uid, {
        fromLevel: level,
        testedLevel,
        score,
        total: questions.length,
        passed,
      });
      if (passed) await updateLevel(testedLevel);
      setPhase("result");
    } catch (err) {
      gooeyToast.error("Không lưu được kết quả", {
        description: err instanceof Error ? err.message : "Thử lại sau.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---- INTRO ----
  if (phase === "intro") {
    if (levelLoading) return <div className="p-6">Đang tải...</div>;

    if (!level) {
      return (
        <div className="mx-auto max-w-xl p-6">
          <p className="mb-3">Bạn chưa chọn trình độ hiện tại.</p>
          <Link to="/settings" className="text-blue-600 underline">
            Đến Settings để chọn
          </Link>
        </div>
      );
    }

    if (!nextLevel) {
      return (
        <div className="mx-auto max-w-xl p-6">
          Bạn đang ở trình độ cao nhất (C2).
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">
          Kiểm tra nâng trình độ: {level} → {nextLevel}
        </h1>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>{LEVEL_TEST_COUNT} câu trắc nghiệm ở mức {nextLevel}</li>
          <li>
            Cần đúng ít nhất {needed}/{LEVEL_TEST_COUNT} câu để lên {nextLevel}
          </li>
          <li>Không đạt có thể làm lại (đề mới mỗi lần)</li>
        </ul>
        <button
          onClick={start}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Bắt đầu
        </button>
      </div>
    );
  }

  // ---- LOADING ----
  if (phase === "loading") {
    return <div className="p-6">⏳ AI đang tạo đề...</div>;
  }

  // ---- TESTING ----
  if (phase === "testing") {
    const q = questions[current];
    const isLast = current === questions.length - 1;
    const allAnswered = questions.every((_, i) => answers[i] !== undefined);

    return (
      <div className="mx-auto max-w-xl space-y-4 p-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Câu {current + 1}/{questions.length}
          </span>
          <span>Mức {testedLevel}</span>
        </div>
        <div className="h-2 rounded bg-gray-200">
          <div
            className="h-2 rounded bg-blue-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="text-lg font-semibold">{q.question}</h2>

        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
              className={`w-full rounded border p-3 text-left ${
                answers[current] === i
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
            className="rounded border px-4 py-2 disabled:opacity-50"
          >
            Trước
          </button>
          {isLast ? (
            <button
              onClick={submit}
              disabled={!allAnswered || submitting}
              className="rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Đang nộp..." : "Nộp bài"}
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Tiếp
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- RESULT ----
  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <div
        className={`rounded-lg p-4 ${
          passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        <h1 className="text-xl font-bold">
          {passed ? `🎉 Chúc mừng! Bạn đã lên ${testedLevel}` : "Chưa đạt"}
        </h1>
        <p>
          Điểm: {score}/{questions.length} (cần {needed})
        </p>
      </div>

      <div className="flex gap-2">
        {passed && nextLevel && (
          <button
            onClick={start}
            className="rounded bg-green-500 px-4 py-2 text-white"
          >
            Thi tiếp lên {nextLevel}
          </button>
        )}
        {!passed && (
          <button
            onClick={start}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Làm lại
          </button>
        )}
        <Link to="/settings" className="rounded border px-4 py-2">
          Về Settings
        </Link>
      </div>

      <h2 className="font-semibold">Câu làm sai</h2>
      {questions.every((q, i) => answers[i] === q.correct_answer) && (
        <p className="text-sm text-gray-500">Không có câu nào sai.</p>
      )}
      {questions.map((q, i) =>
        answers[i] === q.correct_answer ? null : (
          <div key={i} className="space-y-1 rounded border p-3 text-sm">
            <p className="font-medium">{q.question}</p>
            <p className="text-red-600">
              Bạn chọn: {q.options[answers[i]] ?? "(bỏ trống)"}
            </p>
            <p className="text-green-700">
              Đáp án: {q.options[q.correct_answer]}
            </p>
            {q.explanation && (
              <p className="text-gray-600">{q.explanation}</p>
            )}
          </div>
        ),
      )}
    </div>
  );
}