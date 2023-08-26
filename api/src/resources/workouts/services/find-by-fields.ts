import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';

type FindByFieldsArgs = {};
type FindByFieldsErrors = never;
type FindByFieldsReturn = Effect.Effect<never, FindByFieldsErrors, Workout[]>;

export const findWorkoutByFields = ({}: FindByFieldsArgs): FindByFieldsReturn => {
  return Effect.promise(() => prisma.workout.findMany());
};
