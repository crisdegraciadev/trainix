import { ApiPaths } from "@/core/constants/api-paths";
import { Iteration, Page, PageParams, QueryIterationsDTO } from "@/core/types";
import { QueryKeys } from "../query-keys";
import request from "../request";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useFilterIterations(query: QueryIterationsDTO) {
  const initialPageParam = { take: 12, skip: 0 };

  function fetchData(params: PageParams): Promise<Page<Iteration>> {
    return request({
      url: ApiPaths.ITERATIONS,
      method: "query",
      data: { ...query },
      params: { ...params },
    });
  }

  return useInfiniteQuery({
    queryKey: QueryKeys.FILTER_ITERATIONS,
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam,
    getNextPageParam: ({ pageOffset: lastOffset }) => ({
      take: 12,
      skip: lastOffset + 12,
    }),
  });
}
