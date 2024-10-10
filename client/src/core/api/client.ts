import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LocalStorageKeys } from '../constants/local-storage-keys';
import { QueryClient } from '@tanstack/react-query';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const axiosClient = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });
})();

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use((response) => {
  if (response.status === 401) {
    localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
  }

  return response;
});
