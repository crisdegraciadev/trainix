import { WorkoutConsts } from "@/app/dashboard/workouts/consts";

const { Difficulty, Categories, MuscleGroups } = WorkoutConsts.WorkoutData;

export type WorkoutDifficulty =
  | typeof Difficulty.EASY
  | typeof Difficulty.MEDIUM
  | typeof Difficulty.HARD;

export type WorkoutCategory =
  | typeof Categories.UPPER
  | typeof Categories.LOWER
  | typeof Categories.ABS
  | typeof Categories.CARDIO
  | typeof Categories.FULL_BODY;

export type WorkoutMuscleGroups =
  | typeof MuscleGroups.BACK
  | typeof MuscleGroups.BICEPS
  | typeof MuscleGroups.CALVES
  | typeof MuscleGroups.CHEST
  | typeof MuscleGroups.CORE
  | typeof MuscleGroups.GLUTEUS
  | typeof MuscleGroups.HAMSTRINGS
  | typeof MuscleGroups.QUADS
  | typeof MuscleGroups.SHOULDERS
  | typeof MuscleGroups.TRICEPS;

export type Workout = {
  id: string;
  name: string;
  description: string;
  difficulty: WorkoutDifficulty;
  category: WorkoutCategory;
  muscles: WorkoutMuscleGroups[];
};
