import { Difficulty, Muscle } from "../enums";

export type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};

export type CreateExerciseDto = Omit<Exercise, "id">;

export type UpdateExerciseDto = Partial<CreateExerciseDto>;
