import { ApiPaths } from '@/core/constants/api-paths';
import { CreateExerciseDTO } from '@/core/types';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../client';
import { QueryKeys } from '../query-keys';
import request from '../request';

export function useCreateExerciseMutation() {

  function mutationFn(dto: CreateExerciseDTO) {
    return request({
      url: ApiPaths.EXERCISES,
      method: 'post',
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
