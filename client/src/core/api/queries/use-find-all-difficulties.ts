import { ApiPaths } from "@/core/constants/api-paths";
import request from "../request";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";

export function useFindAllDifficulties() {
  function queryFn() {
    return request({
      url: ApiPaths.DIFFICULTIES,
      method: "get",
    });
  }

  return useQuery({
    queryKey: QueryKeys.FIND_ALL_DIFFICULTIES,
    queryFn,
  });
}
