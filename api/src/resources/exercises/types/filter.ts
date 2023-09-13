import { Difficulty, Muscle } from '@prisma/client';

export type ExerciseFacetedFilter = {
  name: string;
  muscles: Muscle[];
  difficulty: Difficulty;
};
