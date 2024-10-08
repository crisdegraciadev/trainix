import { ApiPaths } from '@/core/constants/api-paths';
import { ExerciseDTO } from '@/core/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../query-keys';
import request from '../request';

export function useCreateExerciseMutation() {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: QueryKeys.FIND_EXERCISES });
    },
  });
}
