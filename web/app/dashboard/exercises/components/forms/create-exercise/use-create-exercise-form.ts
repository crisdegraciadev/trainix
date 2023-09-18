import { CREATE_EXERCISE_INITIAL_VALUES } from "../exercise-form-data";
import { useCreateExercise } from "../../../hooks/use-create-exercise";
import { useEffect } from "react";
import { useToast } from "../../../../../../components/ui/use-toast";
import { ExerciseSchema, createExerciseSchema } from "../exercise-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type UseCreateExerciseForm = {
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export const useCreateExerciseForm = ({
  setIsFormOpen,
}: UseCreateExerciseForm) => {
  const { toast } = useToast();

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    reset: mutationReset,
  } = useCreateExercise();

  const form = useForm<ExerciseSchema>({
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

  const onSubmit = (values: ExerciseSchema) => {
    mutate({ exercise: values });
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
