import { ReactQueryKeys } from "@/lib/react-queries";
import { createWorkout } from "@/services/workouts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries(ReactQueryKeys.Query.Workout.FETCH_ALL);
    },
  });

  return { ...mutation };
};
