import { ApiPaths } from '@/core/constants/api-paths';
import { ExerciseDTO } from '@/core/types';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../client';
import { QueryKeys } from '../query-keys';
import request from '../request';

export function useCreateExerciseMutation() {

  function mutationFn(dto: Omit<ExerciseDTO, 'userId'>) {
    return request({
      url: ApiPaths.EXERCISES,
      method: 'put',
      data: { ...dto },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.FILTER_EXERCISES });
    },
  });
}
