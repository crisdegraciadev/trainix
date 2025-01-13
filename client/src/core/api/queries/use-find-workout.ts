import { ApiPaths } from "@/core/constants/api-paths";
import { Workout } from "@/core/types";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import request from "../request";

export function useFindWorkout(id: string) {
  function fetchData(): Promise<Workout> {
    return request({
      url: `${ApiPaths.WORKOUTS}/${id}`,
      method: "get",
    });
  }

  return useQuery({
    queryKey: [QueryKeys.FIND_WORKOUT, id],
    queryFn: () => fetchData(),
  });
}
