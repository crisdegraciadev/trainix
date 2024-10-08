import { ApiPaths } from '@/core/constants/api-paths';
import { RegisterUserDTO } from '@/core/types';
import { useMutation } from '@tanstack/react-query';
import request from '../request';
import { useLoginMutation } from './use-login-mutation';

export function useRegisterMutation() {
  const { mutate } = useLoginMutation();

  function mutationFn(payload: RegisterUserDTO) {
    return request({
      url: ApiPaths.REGISTER,
      method: 'post',
      data: { ...payload },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: (_, { email, password }) => mutate({ email, password }),
  });
}
