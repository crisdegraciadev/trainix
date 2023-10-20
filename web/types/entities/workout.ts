import { Activity } from ".";
import { Category, Difficulty, Muscle } from "../enums";

export type Workout = {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  activities: Activity[];
  muscles: Muscle[];
};

export type CreateWorkoutDto = Omit<Workout, "id" | "activities"> & {
  activityIds: string[];
};
