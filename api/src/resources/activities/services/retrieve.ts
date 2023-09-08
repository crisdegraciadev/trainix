import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';
import { ActivityWithExercise } from '../types';

type RetrieveArgs = { id: number };
type RetrieveErrors = NotFoundError;
type RetrieveReturn = Effect.Effect<never, RetrieveErrors, ActivityWithExercise>;

export const retrieveActivity = ({ id }: RetrieveArgs): RetrieveReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.findUniqueOrThrow({ where: { id }, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
