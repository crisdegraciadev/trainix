import { ApiPaths } from "@/core/constants/api-paths";
import { UpdateWorkoutDTO } from "@/core/types";
import { useMutation } from "@tanstack/react-query";
import request from "../request";

type Props = {
  handleSuccess?: () => void;
  handlError?: () => void;
};

type MutationProps = {
  id: string;
  dto: UpdateWorkoutDTO;
};

export function useUpdateWorkoutMutation({ handleSuccess, handlError }: Props = { handleSuccess: () => {}, handlError: () => {} }) {
  function mutationFn({ id, dto }: MutationProps) {
    return request({
      url: `${ApiPaths.WORKOUTS}/${id}`,
      method: "put",
      data: { ...dto },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: handleSuccess,
    onError: handlError,
  });
}
