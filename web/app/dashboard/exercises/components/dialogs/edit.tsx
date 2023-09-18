import { PlusCircleIcon } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import ExerciseForm from "../forms/exercise-form";
import { Exercise } from "../../../../../types/entities";
import { useEditExerciseForm } from "../../hooks/form/use-edit-exercise-form";

type EditExerciseDialogProps = {
  exercise: Exercise;
  isFormOpen: boolean;
  useInternalTrigger?: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function EditExerciseDialog({
  exercise,
  isFormOpen,
  useInternalTrigger,
  setIsFormOpen,
}: EditExerciseDialogProps) {
  const { form, onSubmit, isLoading } = useEditExerciseForm({
    setIsFormOpen,
    exercise,
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      {useInternalTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-8"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>Edit exercises properties.</DialogDescription>
        </DialogHeader>
        <ExerciseForm
          form={form}
          isLoading={isLoading}
          submitText={"Edit"}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
