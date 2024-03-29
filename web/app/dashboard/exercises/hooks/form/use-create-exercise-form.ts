import { CREATE_EXERCISE_INITIAL_VALUES } from "../../components/forms/exercise-form-data";
import { useCreateExercise } from "../../../../../hooks/exercises/use-create-exercise";
import { useEffect } from "react";
import { useToast } from "../../../../../components/ui/use-toast";
import {
  CreateExerciseSchema,
  createExerciseSchema,
} from "../../components/forms/exercise-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type UseCreateExerciseFormProps = {
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export const useCreateExerciseForm = ({
  setIsFormOpen,
}: UseCreateExerciseFormProps) => {
  const { toast } = useToast();

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    reset: mutationReset,
  } = useCreateExercise();

  const form = useForm<CreateExerciseSchema>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: CREATE_EXERCISE_INITIAL_VALUES,
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      form.reset();
      setIsFormOpen(false);
      mutationReset();
    }
  }, [isLoading, isSuccess, form, mutationReset, setIsFormOpen]);

  useEffect(() => {
    if (isError) {
      mutationReset();
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The provided exercise data is invalid. Please take a look on the displayed errors.",
      });
    }
  }, [isError, mutationReset, toast]);

  const onSubmit = (values: CreateExerciseSchema) => {
    mutate({ createExerciseDto: values });
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
