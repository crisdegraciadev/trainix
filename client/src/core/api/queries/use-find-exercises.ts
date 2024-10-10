import { ApiPaths } from '@/core/constants/api-paths';
import { Exercise, Page, PageParams, QueryExercisesDTO } from '@/core/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from '../query-keys';
import request from '../request';

export function useFindExercises(query: QueryExercisesDTO) {
  const initialPageParam = { take: 12, skip: 0 };

  function fetchData(params: PageParams): Promise<Page<Exercise>> {
    return request({
      url: ApiPaths.EXERCISES,
      method: 'query',
      data: { ...query },
      params: { ...params, ...query },
    });
  }

  return useInfiniteQuery({
    queryKey: QueryKeys.FILTER_EXERCISES,
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam,
    getNextPageParam: ({ pageOffset: lastOffset }) => ({
      take: 12,
      skip: lastOffset + 12,
    }),
  });
}
