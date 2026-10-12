import type { ProficiencyLevel } from "./firestore";

export const LEVELS: ProficiencyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVEL_LABELS: Record<ProficiencyLevel, string> = {
  A1: "A1 – Mới bắt đầu",
  A2: "A2 – Cơ bản",
  B1: "B1 – Trung cấp",
  B2: "B2 – Trung cấp cao",
  C1: "C1 – Nâng cao",
  C2: "C2 – Thành thạo",
};

export const LEVEL_TEST_COUNT = 15;
export const PASS_RATE = 0.8;

export const getNextLevel = (
  level: ProficiencyLevel,
): ProficiencyLevel | null => {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
};