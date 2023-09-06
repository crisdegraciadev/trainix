import { Category, Difficulty, Muscle } from "../enums";

export type Workout = {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  muscles: Muscle[];
};
