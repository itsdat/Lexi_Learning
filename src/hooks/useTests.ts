// hooks/useTests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserTests, saveTests } from "@/lib/firestore";
import { queryKeys } from "@/lib/query-keys";

export function useTests(userId?: string) {
  return useQuery({
    queryKey: queryKeys.tests(userId),
    queryFn: () => getUserTests(userId!),
    enabled: !!userId,
  });
}

export function useSaveTests() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, topic, data }: { userId: string; topic: string; data: any }) =>
      saveTests(userId, topic, data),
    onSuccess: (_r, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tests(variables.userId) });
    },
  });
}