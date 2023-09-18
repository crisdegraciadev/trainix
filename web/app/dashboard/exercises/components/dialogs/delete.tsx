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
import { useDeleteExercise } from "../../hooks/crud/use-delete-exercise";

type DeleteExerciseDialogProps = {
  exerciseId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
};

export default function DeleteExerciseDialog({
  exerciseId,
  isDialogOpen,
  setIsDialogOpen,
}: DeleteExerciseDialogProps) {
  const { mutate } = useDeleteExercise();

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              mutate({ id: exerciseId });
              setIsDialogOpen(false);
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
