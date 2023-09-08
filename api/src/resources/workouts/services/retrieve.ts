import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import { Workout } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type RetrieveArgs = { id: number };
type RetrieveErrors = NotFoundError;
type RetrieveReturn = Effect.Effect<never, RetrieveErrors, Workout>;

export const retrieveWorkout = ({ id }: RetrieveArgs): RetrieveReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
