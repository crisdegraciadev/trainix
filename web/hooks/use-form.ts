import { FormikValues, useFormik } from "formik";

type UseFormProps<T> = {
  initialValues: T;
  onSubmit: (values: FormikValues) => void;
};

export const useForm = <T extends FormikValues>({
  initialValues,
  onSubmit,
}: UseFormProps<T>) => {
  const { handleChange, handleSubmit, values } = useFormik<T>({
    initialValues,
    onSubmit,
  });

  return {
    handlers: {
      handleChange,
      handleSubmit,
    },
    values,
  };
};
