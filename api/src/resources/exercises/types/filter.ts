import { Difficulty, Muscle } from '@prisma/client';

export type ExerciseFacetedFilter = Partial<{
  name: string;
  description: string;
  muscles: Muscle[];
  difficulty: Difficulty;
}>;
