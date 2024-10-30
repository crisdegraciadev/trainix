import { ApiPaths } from "@/core/constants/api-paths";
import { CreateExerciseDTO } from "@/core/types";
import { useMutation } from "@tanstack/react-query";
import request from "../request";

type Props = {
  handleSuccess?: () => void;
  handlError?: () => void;
};

export function useCreateExerciseMutation({ handleSuccess, handlError }: Props = { handleSuccess: () => {}, handlError: () => {} }) {
  function mutationFn(dto: CreateExerciseDTO) {
    return request({
      url: ApiPaths.EXERCISES,
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
