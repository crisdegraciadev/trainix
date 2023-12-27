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

const buildFilters = ({ name, description, muscles, difficulty }: ExerciseFacetedFilter): Prisma.ExerciseWhereInput => {
  const filters: Prisma.ExerciseWhereInput = {};

  if (name) {
    filters.name = { contains: name };
  }

  if (description) {
    filters.name = { contains: description };
  }

  if (difficulty) {
    filters.difficulty = difficulty;
  }

  if (muscles?.length) {
    filters.muscles = { hasSome: muscles };
  }

  return filters;
};
