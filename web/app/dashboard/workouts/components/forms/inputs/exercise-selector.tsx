import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/clsx";
import { Check } from "lucide-react";

const matchingExercises = [
  { name: "Push up", id: "1" },
  { name: "Pull up", id: "2" },
  { name: "Squat", id: "3" },
  { name: "Backlever", id: "4" },
  { name: "Frontlever", id: "5" },
  { name: "Muscle up", id: "6" },
];

type ExerciseSelectorProps = {
  setIsOpen: (isOpen: boolean) => void;
  selectedExerciseIds: string[];
  setSelectedExerciseIds: (selectedExercises: string[]) => void;
};

export default function ExerciseSelector({
  setIsOpen,
  selectedExerciseIds,
  setSelectedExerciseIds,
}: ExerciseSelectorProps) {
  return (
    <Command className="w-full">
      <CommandInput placeholder="Search exercise..." />
      <CommandEmpty>No language found.</CommandEmpty>
      <CommandGroup className="w-full">
        {matchingExercises.map((exercise) => (
          <CommandItem
            id={exercise.name}
            key={exercise.id}
            onSelect={() => {
              setSelectedExerciseIds(
                selectedExerciseIds.includes(exercise.id)
                  ? selectedExerciseIds.filter((id) => exercise.id !== id)
                  : [...selectedExerciseIds, exercise.id]
              );

              setIsOpen(false);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedExerciseIds.includes(exercise.id)
                  ? "opacity-100"
                  : "opacity-0"
              )}
            />
            {exercise.name}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
