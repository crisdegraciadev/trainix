import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../../components/ui/alert-dialog";
import { Button } from "../../../../../components/ui/button";
import { toast } from "../../../../../components/ui/use-toast";
import { useDeleteExercise } from "../../hooks/use-delete-exercise";

type ExerciseDeleteDialogProps = {
  exerciseId: string;
  showDialog: boolean;
  setShowDialog: (value: boolean) => void;
};

export default function ExerciseDeleteDialog({
  exerciseId,
  showDialog,
  setShowDialog,
}: ExerciseDeleteDialogProps) {
  const { mutate } = useDeleteExercise();

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This preset will no longer be
            accessible by you or others you&apos;ve shared it with.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              mutate(exerciseId);
              setShowDialog(false);
              toast({
                description: "This preset has been deleted.",
              });
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
