// hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, setUserLevel, type ProficiencyLevel } from "@/lib/firestore";
import { queryKeys } from "@/lib/query-keys";

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId),
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });
}

export function useSetUserLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, level }: { userId: string; level: ProficiencyLevel }) =>
      setUserLevel(userId, level),
    onSuccess: (_r, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.userId) });
    },
  });
}