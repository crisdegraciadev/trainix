import { fetchWorkouts } from "@/services/workouts";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryKeys } from "../../../../lib/react-queries";

export const useFetchWorkouts = () => {
  const query = useQuery({
    queryKey: ReactQueryKeys.Query.Workout.FETCH_ALL,
    queryFn: fetchWorkouts,
  });

  return { ...query };
};
