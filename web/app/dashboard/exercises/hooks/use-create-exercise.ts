import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise } from "../../../../services/exercises";
import { ReactQueryKeys } from "../../../../lib/react-queries";

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
