import { ApiPaths } from '@/core/constants/api-paths';
import {
  Exercise,
  Page,
  PageParams,
  QueryExercisesDTO
} from '@/core/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryKeys } from '../query-keys';
import request from '../request';

export function useFindExercises(query: QueryExercisesDTO) {
  const initialPageParam = { limit: 12, offset: 0 };

  function fetchData(params: PageParams): Promise<Page<Exercise>> {
    return request({
      url: ApiPaths.EXERCISES,
      method: 'query',
      data: { ...query },
      params: { ...params, ...query },
    });
  }

  return useInfiniteQuery({
    queryKey: QueryKeys.FIND_EXERCISES,
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam,
    getNextPageParam: ({ offset: lastOffset }) => ({
      limit: 12,
      offset: lastOffset + 12,
    }),
  });
}
