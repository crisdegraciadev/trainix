import { useMutation } from "@tanstack/react-query";
import { login } from "../../../services/authentication";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
  });

  return { ...mutation };
};
