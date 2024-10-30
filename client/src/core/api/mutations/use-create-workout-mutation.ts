import { ApiPaths } from "@/core/constants/api-paths";
import { CreateWorkoutDTO } from "@/core/types";
import { useMutation } from "@tanstack/react-query";
import request from "../request";

type Props = {
  handleSuccess?: () => void;
  handlError?: () => void;
};

export function useCreateWorkoutMutation({ handleSuccess, handlError }: Props = { handleSuccess: () => {}, handlError: () => {} }) {
  function mutationFn(dto: CreateWorkoutDTO) {
    return request({
      url: ApiPaths.WORKOUTS,
      method: "post",
      data: { ...dto },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: handleSuccess,
    onError: handlError,
  });
}
