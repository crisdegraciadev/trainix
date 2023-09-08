import { Difficulty, Muscle } from '@prisma/client';

export type ExerciseFacetedFilter = {
  name: string;
  muscles: Muscle[];
  difficulty: Difficulty;
};

export type FilterExerciseByName = {
  name: string;
};
