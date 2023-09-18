import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useToast } from "../../../../../components/ui/use-toast";
import { Exercise } from "../../../../../types/entities";
import {
  ExerciseSchema,
  createExerciseSchema,
} from "../../components/forms/exercise-form-schema";
import { useEditExercise } from "../crud/use-edit-exercise";

type UseEditExerciseForm = {
  setIsFormOpen: (isFormOpen: boolean) => void;
  exercise: Exercise;
};

export const useEditExerciseForm = ({
  setIsFormOpen,
  exercise,
}: UseEditExerciseForm) => {
  const { toast } = useToast();

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    reset: mutationReset,
  } = useEditExercise();

  const form = useForm<ExerciseSchema>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: exercise,
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
    mutate({ id: exercise.id, exercise: values });
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
