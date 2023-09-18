import { Exercise } from "../../../../../../types/entities";
import _ExerciseFormDialog from "../exercise-form";
import { useEditExerciseForm } from "./use-edit-exercise-form";

type EditExerciseFormDialogProps = {
  exercise: Exercise;
  isFormOpen: boolean;
  useInternalTrigger?: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function EditExerciseFormDialog({
  exercise,
  isFormOpen,
  useInternalTrigger,
  setIsFormOpen,
}: EditExerciseFormDialogProps) {
  const { form, onSubmit, isLoading } = useEditExerciseForm({
    setIsFormOpen,
    exercise,
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
        title: "Edit Exercise",
        description: "Edit the properties of your exercises.",
        submit: "Edit",
      }}
      onSubmit={onSubmit}
      setIsFormOpen={setIsFormOpen}
    />
  );
}
