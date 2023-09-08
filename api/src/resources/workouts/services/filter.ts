import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';

type FilterArgs = {};
type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, Workout[]>;

export const filterWorkouts = ({}: FilterArgs): FilterReturn => {
  return Effect.promise(() => prisma.workout.findMany());
};
