import { useQuery } from "@tanstack/react-query";
import { ReactQueryKeys } from "../lib/react-queries";
import { FetchUsersFilters, fetchUsers } from "../services/users";

type UseFetchUsersProps = {
  filters: FetchUsersFilters;
};

export const useFetchUsers = ({ filters }: UseFetchUsersProps) => {
  const query = useQuery({
    queryKey: ReactQueryKeys.Query.User.FETCH_ALL,
    queryFn: () => fetchUsers({ filters }),
    enabled: Object.values(filters).every((val) => !!val),
  });

  return { ...query };
};
