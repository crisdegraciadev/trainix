import { ReactQueryKeys } from "@/lib/react-queries";
import { createExercise } from "@/services/exercises";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.Query.Exercise.FETCH_ALL);
    },
  });

  return { ...mutation };
};
