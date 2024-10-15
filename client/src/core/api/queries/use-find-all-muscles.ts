import { ApiPaths } from "@/core/constants/api-paths";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import request from "../request";

export function useFindAllMuscles() {
  function queryFn() {
    return request({
      url: ApiPaths.MUSCLES,
      method: "get",
    });
  }

  return useQuery({
    queryKey: QueryKeys.FIND_ALL_MUSCLES,
    queryFn,
  });
}
