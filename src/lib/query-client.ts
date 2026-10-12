// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 5000, // 5 phút coi là "fresh", tránh refetch liên tục
      retry: 1,
    },
  },
});