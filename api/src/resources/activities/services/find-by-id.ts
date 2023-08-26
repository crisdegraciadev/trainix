import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';
import { ActivityWithExercise } from '../types';

type FindByIdArgs = { id: number };
type FindByIdErrors = NotFoundError;
type FindByIdReturn = Effect.Effect<never, FindByIdErrors, ActivityWithExercise>;

export const findActivityById = ({ id }: FindByIdArgs): FindByIdReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.findUniqueOrThrow({ where: { id }, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
