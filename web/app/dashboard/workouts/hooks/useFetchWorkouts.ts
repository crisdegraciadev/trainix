import { fetchWorkouts } from "@/services/workouts";
import { useQuery } from "@tanstack/react-query";

export const useFetchWorkouts = () => {
  const query = useQuery({ queryKey: ["workouts"], queryFn: fetchWorkouts });

  return { ...query };
};
