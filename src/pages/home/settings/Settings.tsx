import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gooeyToast } from "goey-toast";
import BaseSelect, {
  type BaseSelectProps,
} from "@/components/common/select/BaseSelect";
import { useAuth } from "@/context/AuthContext";
import type { ProficiencyLevel } from "@/lib/firestore";
import { LEVELS, LEVEL_LABELS, getNextLevel } from "@/lib/levels";

export default function Settings() {
  const { level, levelLoading, updateLevel } = useAuth();
  const [selected, setSelected] = useState<ProficiencyLevel | undefined>(
    undefined,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (level) setSelected(level);
  }, [level]);

  const options: BaseSelectProps[] = LEVELS.map((l) => ({
    labelDisplay: LEVEL_LABELS[l],
    value: l,
    label: LEVEL_LABELS[l],
  }));

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateLevel(selected);
      gooeyToast.success("Đã lưu trình độ", {
        description: `Trình độ hiện tại: ${selected}`,
      });
    } catch (err) {
      gooeyToast.error("Không lưu được trình độ", {
        description: err instanceof Error ? err.message : "Thử lại sau.",
      });
    } finally {
      setSaving(false);
    }
  };

  const nextLevel = level ? getNextLevel(level) : null;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="space-y-3 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Trình độ hiện tại</h2>
          <p className="text-sm text-gray-500">
            Dùng làm mặc định khi tạo flashcard và bài tập.
          </p>
        </div>

        {levelLoading ? (
          <p className="text-sm text-gray-500">Đang tải...</p>
        ) : (
          <>
            <BaseSelect
              options={options}
              value={selected}
              onValueChange={(v) => setSelected(v as ProficiencyLevel)}
              placeholder="Chọn trình độ"
            />
            <button
              onClick={handleSave}
              disabled={saving || !selected || selected === level}
              className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </>
        )}
      </section>

      {level && nextLevel && (
        <section className="space-y-3 rounded-lg border p-4">
          <div>
            <h2 className="font-semibold">Kiểm tra nâng trình độ</h2>
            <p className="text-sm text-gray-500">
              Làm bài kiểm tra {nextLevel}. Đạt từ 80% sẽ tự nâng lên {nextLevel}.
            </p>
          </div>
          <Link
            to="/level-test"
            className="inline-block rounded bg-green-500 px-4 py-2 text-white"
          >
            Làm bài kiểm tra {nextLevel}
          </Link>
        </section>
      )}
    </div>
  );
} 