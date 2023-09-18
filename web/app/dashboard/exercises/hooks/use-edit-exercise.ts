import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise, editExercise } from "../../../../services/exercises";
import { ReactQueryKeys } from "../../../../lib/react-queries";

export const useEditExercise = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExercise,
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.Query.Exercise.FETCH_ALL);
    },
  });

  return { ...mutation };
};
