import React from "react";
import { useCreateWorkoutForm } from "../../hooks/form/use-create-workout-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { WorkoutForm } from "../forms/workout-form";

type CreateExerciseDialogProps = {
  isFormOpen: boolean;
  useInternalTrigger?: boolean;
  setIsFormOpen: (isFormOpen: boolean) => void;
};

export default function CreateWorkoutDialog({
  isFormOpen,
  useInternalTrigger,
  setIsFormOpen,
}: CreateExerciseDialogProps) {
  const { form, onSubmit, isLoading } = useCreateWorkoutForm({
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

      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Create Workout</DialogTitle>
          <DialogDescription>Create your workout.</DialogDescription>
        </DialogHeader>

        <WorkoutForm
          form={form}
          isLoading={isLoading}
          submitText={"Create"}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
