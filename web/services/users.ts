import { ApiPaths } from "../consts/api-paths";
import { sendGetRequest } from "../lib/axios";
import { User } from "../types/entities/user";

type FetchUsersArgs = {
  filters: FetchUsersFilters;
};

export type FetchUsersFilters = Partial<{
  username: string;
  email: string;
}>;

export async function fetchUsers({ filters }: FetchUsersArgs): Promise<User[]> {
  const res = await sendGetRequest<User[]>({
    path: ApiPaths.USERS,
    params: filters,
  });

  const { data } = res;
  return data;
}
