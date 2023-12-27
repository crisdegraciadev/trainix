import { Effect, pipe } from 'effect';
import prisma from '../../../config/prisma';
import { Exercise, Prisma } from '@prisma/client';
import { ExerciseFacetedFilter } from '../types';
import { Paginated } from '../../../types/paginated';
import { buildPage } from '../../../utils/build-page';

type FilterArgs = {
  facetedFilters?: ExerciseFacetedFilter;
  skip: number;
  take: number;
};

type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, Paginated<Exercise[]>>;

export const filterExercises = ({ facetedFilters, skip, take }: FilterArgs): FilterReturn => {
  const filters = facetedFilters ? buildFilters(facetedFilters) : {};

  return pipe(
    Effect.all([
      Effect.promise(() => prisma.exercise.findMany({ skip: skip * take, take, where: filters })),
      Effect.promise(() => prisma.exercise.count()),
    ]),
    Effect.flatMap((data) => buildPage({ skip, take, data }))
  );
};

const buildFilters = ({ name, muscles, difficulty }: ExerciseFacetedFilter): Prisma.ExerciseWhereInput => {
  return {
    name,
    difficulty,
    muscles: { hasSome: muscles },
  };
};
