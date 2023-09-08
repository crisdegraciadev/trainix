import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { Exercise } from '@prisma/client';

type RemoveArgs = { id: number };
type RemoveErrors = NotFoundError;
type RemoveReturn = Effect.Effect<never, RemoveErrors, Exercise>;

export const deleteExercise = ({ id }: RemoveArgs): RemoveReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.delete({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
