import { ApiPaths } from "@/core/constants/api-paths";
import request from "../request";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../client";
import { QueryKeys } from "../query-keys";

export function useDeleteExerciseMutation() {
  function mutationFn(id: string) {
    return request({
      url: `${ApiPaths.EXERCISES}/${id}`,
      method: "delete",
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.FILTER_EXERCISES });
    },
  });
}
