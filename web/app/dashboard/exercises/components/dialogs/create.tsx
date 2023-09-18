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
import { useCreateExerciseForm } from "../../hooks/use-create-exercise-form";
import ExerciseForm from "../forms/exercise-form";

type CreateExerciseDialogProps = {
  isFormOpen: boolean;
  useInternalTrigger?: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function CreateExerciseDialog({
  isFormOpen,
  useInternalTrigger,
  setIsFormOpen,
}: CreateExerciseDialogProps) {
  const { form, onSubmit, isLoading } = useCreateExerciseForm({
    setIsFormOpen,
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
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Create
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
          <DialogDescription>Create your custom exercises.</DialogDescription>
        </DialogHeader>

        <ExerciseForm
          form={form}
          isLoading={isLoading}
          submitText={"Create"}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
