import { ReactQueryKeys } from "@/lib/react-queries";
import { editExercise } from "@/services/exercises";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
