import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';

type RemoveArgs = { id: number };
type RemoveErrors = NotFoundError;
type RemoveReturn = Effect.Effect<never, RemoveErrors, Workout>;

export const deleteWorkout = ({ id }: RemoveArgs): RemoveReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.delete({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
