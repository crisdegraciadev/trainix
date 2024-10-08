import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { LocalStorageKeys } from '../constants/local-storage-keys';

export const client = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });
})();

client.interceptors.request.use(
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

client.interceptors.response.use((response) => {
  if (response.status === 401) {
    localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
  }

  return response;
});
