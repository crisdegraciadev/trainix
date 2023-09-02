import { useState } from "react";
import { LOGIN_FORM_INITIAL_VALUES } from "./user-login-form-data";
import { login } from "@/services/authentication";
import { useForm } from "@/hooks/use-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AppPaths } from "@/consts/app-paths";

export const useUserLoginForm = () => {
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { push } = useRouter();

  const { values, handlers } = useForm({
    initialValues: LOGIN_FORM_INITIAL_VALUES,
    onSubmit: async (values) => {
      setIsFormLoading(true);
      const { email, password } = values;
      try {
        await login({ email, password });
        push(AppPaths.DASHBOARD);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Your credentials seems to be invalid, try it again with valid credentials.",
        });
      } finally {
        setIsFormLoading(false);
      }
    },
  });

  return {
    form: {
      values,
      handlers,
    },
    state: {
      isFormLoading,
    },
  };
};
