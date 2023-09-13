import { Global } from "@/consts/global";
import axios, { AxiosResponse } from "axios";

type SendPostRequestArgs = {
  path: string;
  data: Record<string, unknown>;
};

export async function sendPostRequest<T>({
  path,
  data,
}: SendPostRequestArgs): Promise<AxiosResponse<T>> {
  return axios.post<T>(`${Global.API_ENDPOINT}/${path}`, data, {
    withCredentials: true,
  });
}

type SendGetRequestArgs = {
  path: string;
  params?: Record<string, string | number | boolean>;
};

export async function sendGetRequest<T>({
  path,
  params,
}: SendGetRequestArgs): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${Global.API_ENDPOINT}/${path}`, {
    withCredentials: true,
    params,
  });
}

type SendDeleteRequestArgs = {
  id: string;
  path: string;
};

export async function sendDeleteRequest<T>({
  path,
  id,
}: SendDeleteRequestArgs): Promise<AxiosResponse<T>> {
  return axios.delete<T>(`${Global.API_ENDPOINT}/${path}/${id}`, {
    withCredentials: true,
  });
}
