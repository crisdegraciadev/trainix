import { Exercise } from '@prisma/client';
import { NotFoundError } from '../../../errors/types';
import { UpdateExerciseDto } from '../types';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type UpdateArgs = { id: number; data: UpdateExerciseDto };
type UpdateErrors = NotFoundError;
type UpdateReturn = Effect.Effect<never, UpdateErrors, Exercise>;

export const updateExercise = ({ id, data }: UpdateArgs): UpdateReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.update({ where: { id }, data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
