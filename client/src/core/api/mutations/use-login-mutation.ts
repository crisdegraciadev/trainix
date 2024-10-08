import { ApiPaths } from '@/core/constants/api-paths';
import { LocalStorageKeys } from '@/core/constants/local-storage-keys';
import { useAuthStore } from '@/core/state/auth-store';
import { useMutation } from '@tanstack/react-query';
import { useLocalStorage } from '@uidotdev/usehooks';
import request from '../request';
import { LoginDTO } from '@/core/types';

export function useLoginMutation() {
  const [_, setAccessToken] = useLocalStorage<string>(
    LocalStorageKeys.ACCESS_TOKEN,
  );

  const setIsLoggedIn = useAuthStore(({ setIsLoggedIn }) => setIsLoggedIn);

  function mutationFn(credentials: LoginDTO) {
    return request({
      url: ApiPaths.LOGIN,
      method: 'post',
      data: { ...credentials },
    })
  }

  function onLoginSuccess(token: string) {
    console.log({ token });
    setAccessToken(token);
    setIsLoggedIn(true);
  }

  return useMutation({
    mutationFn,
    onSuccess: ({ token }) => onLoginSuccess(token),
    onMutate: () => console.log('WTF'),
  });
}
