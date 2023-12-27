import { Difficulty, Exercise, Muscle } from '@prisma/client';
import { Paginated } from '../../../types/paginated';

export type CreateExerciseDto = {
  name: string;
  description: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};

export type UpdateExerciseDto = Partial<CreateExerciseDto>;

export type ResponseExerciseDto = Exercise;

export type ResponseExercisesDto = Paginated<Exercise[]>;
