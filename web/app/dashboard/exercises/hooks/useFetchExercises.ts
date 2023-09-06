import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../../../services/exercises";

export const useFetchExercises = () => {
  const query = useQuery({ queryKey: ["exercises"], queryFn: fetchExercises });

  return { ...query };
};
