export type Workout = {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: "upper" | "lower" | "abs" | "full-body" | "cardio";
  muscleGroups: string[];
};
