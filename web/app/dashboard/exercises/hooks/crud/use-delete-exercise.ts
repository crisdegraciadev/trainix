import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise } from "../../../../../services/exercises";
import { ReactQueryKeys } from "../../../../../lib/react-queries";

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
