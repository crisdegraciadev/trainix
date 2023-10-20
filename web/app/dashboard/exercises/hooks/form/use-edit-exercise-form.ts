import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useToast } from "../../../../../components/ui/use-toast";
import { Exercise } from "../../../../../types/entities";
import {
  CreateExerciseSchema,
  createExerciseSchema,
} from "../../components/forms/exercise-form-schema";
import { useEditExercise } from "../../../../../hooks/exercises/use-edit-exercise";

type UseEditExerciseFormProps = {
  setIsFormOpen: (isFormOpen: boolean) => void;
  exercise: Exercise;
};

export const useEditExerciseForm = ({
  setIsFormOpen,
  exercise,
}: UseEditExerciseFormProps) => {
  const { toast } = useToast();

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    reset: mutationReset,
  } = useEditExercise();

  const form = useForm<CreateExerciseSchema>({
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

  const onSubmit = (values: CreateExerciseSchema) => {
    mutate({ id: exercise.id, updateExerciseDto: values });
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
