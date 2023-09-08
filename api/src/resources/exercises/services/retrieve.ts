import { Effect } from 'effect';
import { Exercise } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';

type RetrieveArgs = { id: number };
type RetrieveErrors = NotFoundError;
type RetrieveReturn = Effect.Effect<never, RetrieveErrors, Exercise>;

export const retrieveExercise = ({ id }: RetrieveArgs): RetrieveReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
