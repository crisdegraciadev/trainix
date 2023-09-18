import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Exercise } from "../../../../../types/entities";
import { capitalize } from "../../../../../utils";
import { Badge } from "../../../../../components/ui/badge";
import { nanoid } from "nanoid";

type ViewExerciseDialogProps = {
  exercise: Exercise;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
};

export default function ViewExerciseDialog({
  exercise,
  isDialogOpen,
  setIsDialogOpen,
}: ViewExerciseDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-medium mb-1">Description</h3>
            <span className="text-sm text-muted-foreground">
              {capitalize(exercise.description)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-medium mb-1">Difficulty</h3>
            <span className="text-sm text-muted-foreground">
              {capitalize(exercise.difficulty)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-medium mb-1">Muscles</h3>
            <div className="flex flex-wrap gap-1">
              {exercise.muscles.map((muscle) => (
                <Badge
                  className="rounded-md"
                  key={nanoid()}
                  variant="secondary"
                >
                  {capitalize(muscle)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
