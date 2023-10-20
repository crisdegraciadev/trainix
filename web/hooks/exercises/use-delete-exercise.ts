import { ReactQueryKeys } from "@/lib/react-queries";
import { deleteExercise } from "@/services/exercises";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.Query.Exercise.FETCH_ALL);
    },
  });

  return { ...mutation };
};
