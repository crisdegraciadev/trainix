import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { axiosClient } from './client';

const request = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    return response.data;
  };

  const onError = function(error: AxiosError) {
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });
  };

  return axiosClient(options).then(onSuccess).catch(onError);
};

export default request;
