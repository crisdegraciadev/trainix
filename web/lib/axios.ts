import { Global } from "@/consts/global";
import axios, { AxiosResponse } from "axios";

type SendPostRequestArgs = {
  path: string;
  data: Record<string, unknown>;
};

export async function sendPostRequest({
  path,
  data,
}: SendPostRequestArgs): Promise<AxiosResponse> {
  return axios.post(`${Global.API_ENDPOINT}/${path}`, data, {
    withCredentials: true,
  });
}
