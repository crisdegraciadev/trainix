import { useEffect, useState } from "react";
import { LOGIN_FORM_INITIAL_VALUES } from "./user-login-form-data";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AppPaths } from "@/consts/app-paths";
import { useLogin } from "../hooks/use-login";
import { UserLoginSchema, userLoginSchema } from "./user-login-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFetchUsers } from "../../../hooks/use-fetch-users";
import { useAuthActions } from "../../../hooks/store/use-auth-actions";

export const useUserLoginForm = () => {
  const { toast } = useToast();
  const { push } = useRouter();
  const { setLoggedUser } = useAuthActions();

  const [email, setEmail] = useState("");

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
    reset: mutationReset,
  } = useLogin();

  const { data: users } = useFetchUsers({ filters: { email } });

  const form = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: LOGIN_FORM_INITIAL_VALUES,
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      push(AppPaths.DASHBOARD);
      mutationReset();
    }
  }, [isLoading, isSuccess, form, mutationReset, push]);

  useEffect(() => {
    if (isError) {
      mutationReset();
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Your credentials seems to be invalid, try it again with valid credentials.",
      });

      console.log({ error });
    }
  }, [isError, error, mutationReset, toast]);

  useEffect(() => {
    if (email && users?.length === 1) {
      const [loggedUser] = users;
      setLoggedUser(loggedUser);
    }
  }, [email, setLoggedUser, users]);

  const onSubmit = (values: UserLoginSchema) => {
    mutate({ ...values });
    setEmail(values.email);
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
