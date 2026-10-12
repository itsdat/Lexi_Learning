import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ProficiencyLevel } from "./firestore";

// Giữ trùng tên model với lib/ai.ts
const GEMINI_MODEL = "gemini-3.5-flash";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface LevelTestQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

const cleanJSON = (text: string) =>
  text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Retry khi Gemini quá tải (503), giống ai.ts
const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 2000,
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (error?.message?.includes("503") && i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
  throw lastError;
};

export const generateLevelTest = async (
  level: ProficiencyLevel,
  count: number,
): Promise<LevelTestQuestion[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }

  const prompt = `You are an English exam writer. Create ${count} multiple-choice questions to test CEFR level ${level}.
Mix grammar, vocabulary, short reading (one-sentence context) and common expressions. Difficulty must match ${level}, not easier.
Each question has exactly 4 options and exactly one correct answer. Wrong options must be plausible.
Write "explanation" in Vietnamese (1 sentence, why the answer is correct).
Return ONLY a JSON object:
{"questions":[{"question":"...","options":["...","...","...","..."],"correct_answer":0,"explanation":"..."}]}`;

  const parsed = await retryRequest(async () => {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanJSON(result.response.text()));
  });

  const raw: any[] = Array.isArray(parsed?.questions) ? parsed.questions : [];

  const valid = raw
    .filter(
      (q) =>
        typeof q?.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        new Set(q.options).size === 4 &&
        Number.isInteger(q.correct_answer) &&
        q.correct_answer >= 0 &&
        q.correct_answer < 4,
    )
    .map((q) => {
      // Shuffle để đáp án đúng không bị lệch vị trí do AI
      const correctText = q.options[q.correct_answer];
      const options = shuffle<string>(q.options);
      return {
        question: q.question,
        options,
        correct_answer: options.indexOf(correctText),
        explanation: typeof q.explanation === "string" ? q.explanation : "",
      } as LevelTestQuestion;
    });

  if (valid.length < Math.min(count, 5)) {
    throw new Error("AI trả về dữ liệu không hợp lệ, vui lòng thử lại.");
  }
  return valid;
};
