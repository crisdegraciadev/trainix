import { UpdateExerciseDTO } from "@/core/types";
import request from "../request";
import { ApiPaths } from "@/core/constants/api-paths";
import { QueryKeys } from "../query-keys";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../client";

type MutationProps = {
  id: string;
  dto: UpdateExerciseDTO;
};

export function useUpdateExerciseMutation() {
  function mutationFn({ id, dto }: MutationProps) {
    return request({
      url: `${ApiPaths.EXERCISES}/${id}`,
      method: "put",
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
