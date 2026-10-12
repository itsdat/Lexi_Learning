// hooks/useFlashcards.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFlashcards, saveFlashcards } from "@/lib/firestore";
import { queryKeys } from "@/lib/query-keys";

export function useGetAllFlashcards(userId?: string) {
  return useQuery({
    queryKey: queryKeys.flashcards(userId),
    queryFn: () => getUserFlashcards(userId!),
    enabled: !!userId, // chỉ chạy khi đã có userId
    // placeholderData: [],
  });
}

export function useSaveFlashcards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      topic,
      data,
    }: {
      userId: string;
      topic: string;
      data: any;
    }) => saveFlashcards(userId, topic, data),

    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcards(variables.userId),
      });
    },
  });
}
