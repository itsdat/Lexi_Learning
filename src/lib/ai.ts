import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cleanJSON = (text: string) => {
  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
};

// Retry logic
const retryRequest = async (fn: () => Promise<any>, maxRetries = 3, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.message?.includes("503") && i < maxRetries - 1) {
        console.log(`Retry ${i + 1}/${maxRetries}... waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export const generateFlashcards = async (topic: string, level: string, count: number) => {
  try {
    const data = await retryRequest(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

      const prompt = `Generate ${count} English flashcards. 
Topic: ${topic}
Level: ${level}

Return ONLY JSON:
{
  "flashcards": [
    {
      "word": "hello",
      "phonetic": "hə'loʊ",
      "vietnamese": "xin chào",
      "example": "Hello, how are you?",
      "exampleVietnamese": "Xin chào, bạn khỏe không?"
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      console.log("Raw response:", text);
      
      const cleanedText = cleanJSON(text);
      const parsed = JSON.parse(cleanedText);
      
      return parsed;
    });
    
    return data;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const generateTests = async (topic: string, level: string, count: number) => {
  try {
    const data = await retryRequest(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

      const prompt = `Generate ${count} English tests for "${topic}" at level ${level}.

Return ONLY JSON:
{
  "tests": [
    {
      "question": "What is 'mèo' in English?",
      "options": ["cat", "dog", "bird", "fish"],
      "correctAnswer": 0
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      console.log("Raw response:", text);
      
      const cleanedText = cleanJSON(text);
      const parsed = JSON.parse(cleanedText);
      
      return parsed;
    });
    
    return data;
  } catch (error) {
    console.error("Error generating tests:", error);
    throw error;
  }
};