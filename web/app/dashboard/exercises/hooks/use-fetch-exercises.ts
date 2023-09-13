import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../../../services/exercises";
import { ReactQueryKeys } from "../../../../lib/react-queries";

export const useFetchExercises = () => {
  const query = useQuery({
    queryKey: ReactQueryKeys.Query.Exercise.FETCH_ALL,
    queryFn: fetchExercises,
  });

  return { ...query };
};
