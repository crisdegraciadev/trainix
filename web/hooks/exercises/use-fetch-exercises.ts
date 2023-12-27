import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../services/exercises";
import { ReactQueryKeys } from "../../lib/react-queries";
import { PaginationState } from "@tanstack/react-table";

export const useFetchExercises = ({
  pageIndex: skip,
  pageSize: take,
}: PaginationState) => {
  const query = useQuery({
    queryKey: [ReactQueryKeys.Query.Exercise.FETCH_ALL, skip, take],
    queryFn: () => fetchExercises({ skip, take }),
  });

  return { ...query };
};
