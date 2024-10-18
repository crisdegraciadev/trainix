import { ApiPaths } from "@/core/constants/api-paths";
import request from "../request";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../client";
import { QueryKeys } from "../query-keys";
import { UpdateWorkoutDTO } from "@/core/types";

type MutationProps = {
  id: string;
  dto: UpdateWorkoutDTO;
};

export function useUpdateWorkoutMutation() {
  function mutationFn({ id, dto }: MutationProps) {
    return request({
      url: `${ApiPaths.WORKOUTS}/${id}`,
      method: "put",
      data: { ...dto },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.FILTER_WORKOUTS });
    },
  });
}
