import { ApiPaths } from "@/core/constants/api-paths";
import request from "../request";
import { CreateWorkoutDTO } from "@/core/types";
import { queryClient } from "../client";
import { QueryKeys } from "../query-keys";
import { useMutation } from "@tanstack/react-query";

export function useCreateWorkoutMutation() {
  function mutationFn(dto: CreateWorkoutDTO) {
    return request({
      url: ApiPaths.WORKOUTS,
      method: "post",
      data: { ...dto },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.FILTER_EXERCISES });
    },
  });
}
