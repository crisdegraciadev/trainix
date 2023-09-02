import { ApiPaths } from "@/consts/api-paths";
import { sendPostRequest } from "@/lib/axios";
import { AxiosResponse } from "axios";

type LoginArgs = {
  email: string;
  password: string;
};

export async function login({
  email,
  password,
}: LoginArgs): Promise<AxiosResponse> {
  return sendPostRequest({ path: ApiPaths.LOGIN, data: { email, password } });
}
