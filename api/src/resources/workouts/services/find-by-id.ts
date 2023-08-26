import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import { Workout } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type FindByIdArgs = { id: number };
type FindByIdErrors = NotFoundError;
type FindByIdReturn = Effect.Effect<never, FindByIdErrors, Workout>;

export const findWorkoutById = ({ id }: FindByIdArgs): FindByIdReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
