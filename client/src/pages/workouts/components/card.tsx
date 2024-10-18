import { Workout } from "@/core/types";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { MuscleList } from "@/components/muscle-list";

export default function WorkoutCard(workout: Workout) {
  const { name, difficulty, description, muscles } = workout;

  return (
    <div>
      <span className="sr-only">View Exercise</span>

      <div className="overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
        <div className="p-4 bg-background flex flex-col space-y-2 min-h-[120px]">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold truncate">{name}</h3>
            <DifficultyBadge difficulty={difficulty} />
          </div>
          <p className="text-sm text-muted-foreground h-10 line-clamp-2">{description}</p>
          <MuscleList muscles={muscles} />
        </div>
      </div>
    </div>
  );
}
