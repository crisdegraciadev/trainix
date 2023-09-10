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
};

export async function sendGetRequest<T>({
  path,
}: SendGetRequestArgs): Promise<AxiosResponse<T>> {
  return axios.get<T>(`${Global.API_ENDPOINT}/${path}`, {
    withCredentials: true,
  });
}
