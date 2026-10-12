// lib/queryKeys.ts
export const queryKeys = {
  flashcards: (userId?: string) => ["flashcards", userId] as const,
  tests: (userId?: string) => ["tests", userId] as const,
  userProfile: (userId?: string) => ["userProfile", userId] as const,
};