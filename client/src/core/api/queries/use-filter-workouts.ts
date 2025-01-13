import { ApiPaths } from "@/core/constants/api-paths";
import { Page, PageParams, QueryWorkoutsDTO, Workout } from "@/core/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import request from "../request";

export function useFilterWorkouts(query: QueryWorkoutsDTO) {
  const initialPageParam = { take: 12, skip: 0 };

  function fetchData(params: PageParams): Promise<Page<Workout>> {
    return request({
      url: ApiPaths.WORKOUTS,
      method: "query",
      data: { ...query },
      params: { ...params, ...query },
    });
  }

  return useInfiniteQuery({
    queryKey: QueryKeys.FILTER_WORKOUTS,
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam,
    getNextPageParam: ({ pageOffset: lastOffset }) => ({
      take: 12,
      skip: lastOffset + 12,
    }),
  });
}
