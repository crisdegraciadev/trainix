import { ApiPaths } from "@/core/constants/api-paths";
import request from "../request";
import { useMutation } from "@tanstack/react-query";

export function useValidateTokenMutation(token: string) {
  function mutationFn() {
    return request({
      url: ApiPaths.VALIDATE_TOKEN,
      method: "post",
      data: { token },
    });
  }

  return useMutation({
    mutationFn,
    onSuccess: () => console.log("Valid token"),
    onError: () => console.log("INVALID TOKEN")
  });
}
