import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { Exercise, Prisma } from '@prisma/client';
import { ExerciseFacetedFilter } from '../types';

type FilterArgs = { facetedFilters?: ExerciseFacetedFilter };
type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, Exercise[]>;

export const filterExercises = ({ facetedFilters }: FilterArgs): FilterReturn => {
  const filters = facetedFilters ? buildFilters(facetedFilters) : {};
  return Effect.promise(() => prisma.exercise.findMany({ where: filters }));
};

const buildFilters = ({ name, muscles, difficulty }: ExerciseFacetedFilter): Prisma.ExerciseWhereInput => {
  return {
    name,
    difficulty,
    muscles: { hasSome: muscles },
  };
};
