import { Difficulty, Exercise, Muscle } from '@prisma/client';

export type CreateExerciseDto = {
  name: string;
  description: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};

export type UpdateExerciseDto = Partial<CreateExerciseDto>;

export type ResponseExerciseDto = Exercise;
