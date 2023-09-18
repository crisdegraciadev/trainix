import { useCreateExerciseForm } from "./use-create-exercise-form";
import _ExerciseFormDialog from "../exercise-form";

type CreateExerciseFormDialogProps = {
  isFormOpen: boolean;
  useInternalTrigger?: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function CreateExerciseFormDialog({
  isFormOpen,
  useInternalTrigger,
  setIsFormOpen,
}: CreateExerciseFormDialogProps) {
  const { form, onSubmit, isLoading } = useCreateExerciseForm({
    setIsFormOpen,
  });

  return (
    <_ExerciseFormDialog
      form={form}
      flags={{
        isLoading,
        isFormOpen,
        useInternalTrigger,
      }}
      text={{
        title: "Create Exercise",
        description: "Create custom exercises.",
        internalTrigger: "Create",
        submit: "Create",
      }}
      onSubmit={onSubmit}
      setIsFormOpen={setIsFormOpen}
    />
  );
}
