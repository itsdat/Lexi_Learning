const cleanJSON = (text: string) => {
  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
};

const callGroqAPI = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GROQ_API_KEY");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
         model: "llama-3.3-70b-versatile", // ✅ Model mới
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Speaking Practice
export const generateSpeakingPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} speaking practice exercises for topic "${topic}" at level ${level}.
Each should have a word/phrase/sentence for learner to pronounce.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "text": "Hello, how are you?",
      "phonetic": "hə'loʊ, haʊ ɑr ju",
      "vietnamese": "Xin chào, bạn khỏe không?",
      "difficulty": "easy"
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Speaking error:", error.message);
    throw error;
  }
};

// Listening Practice
export const generateListeningPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} listening practice exercises for topic "${topic}" at level ${level}.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "audio_text": "I like to eat apples",
      "question": "What does the person like to eat?",
      "options": ["apples", "oranges", "bananas", "grapes"],
      "correct_answer": 0,
      "vietnamese_question": "Người đó thích ăn gì?"
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Listening error:", error.message);
    throw error;
  }
};

// Writing Practice
export const generateWritingPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} writing practice exercises for topic "${topic}" at level ${level}.
Each exercise should have a sentence with a blank (_____) to fill in.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "sentence": "I _____ to eat apples every day.",
      "answer": "like",
      "options": ["like", "love", "eat", "enjoy"],
      "vietnamese": "Tôi thích ăn táo mỗi ngày.",
      "type": "fill_blank"
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Writing error:", error.message);
    throw error;
  }
};

// Dictation Practice
export const generateDictationPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} dictation exercises for topic "${topic}" at level ${level}.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "sentence": "The weather is beautiful today.",
      "vietnamese": "Thời tiết hôm nay rất đẹp.",
      "difficulty": "easy",
      "word_count": 5
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Dictation error:", error.message);
    throw error;
  }
};

// Multiple Choice Practice
export const generateMultipleChoicePractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} multiple choice exercises for topic "${topic}" at level ${level}.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "question": "What is the past tense of 'eat'?",
      "options": ["eat", "ate", "eating", "eats"],
      "correct_answer": 1,
      "vietnamese_question": "Quá khứ của 'eat' là gì?"
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Multiple choice error:", error.message);
    throw error;
  }
};

// Matching Practice
export const generateMatchingPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} matching exercises for topic "${topic}" at level ${level}.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "questions": ["How are you?", "What is your name?"],
      "answers": ["I'm from Vietnam", "My name is John", "I'm fine"]
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Matching error:", error.message);
    throw error;
  }
};

// Sorting Practice
export const generateSortingPractice = async (
  topic: string,
  level: string,
  count: number
) => {
  try {
    const prompt = `Generate ${count} word ordering exercises for topic "${topic}" at level ${level}.

Return ONLY JSON (no markdown):
{
  "exercises": [
    {
      "id": 1,
      "words": ["eat", "I", "apples", "like", "to"],
      "correct_order": ["I", "like", "to", "eat", "apples"],
      "sentence": "I like to eat apples.",
      "vietnamese": "Tôi thích ăn táo."
    }
  ]
}`;

    const text = await callGroqAPI(prompt);
    const cleanedText = cleanJSON(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Sorting error:", error.message);
    throw error;
  }
};