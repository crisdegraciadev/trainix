import { useToast } from "@/components/ui/use-toast";
import { useCreateWorkout } from "../crud/use-create-workout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateWorkoutSchema,
  createWorkoutSchema,
} from "../../components/forms/workout-form-schema";
import { CREATE_WORKOUT_INITIAL_VALUES } from "../../components/forms/workout-form-data";
import { useEffect } from "react";

type UseCreateWorkoutFormProps = {
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export const useCreateWorkoutForm = ({
  setIsFormOpen,
}: UseCreateWorkoutFormProps) => {
  const { toast } = useToast();

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    reset: mutationReset,
  } = useCreateWorkout();

  const form = useForm<CreateWorkoutSchema>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: CREATE_WORKOUT_INITIAL_VALUES,
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

  const onSubmit = (values: CreateWorkoutSchema) => {
    // TODO: Create activities and link them
    const { activities, ...workout } = values;

    console.log({ values });

    mutate({ createWorkoutDto: { ...workout, activityIds: [] } });
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
