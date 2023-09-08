import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { UpdateWorkoutDto } from '../types';
import { NotFoundError } from '../../../errors/types';

type UpdateArgs = { id: number; data: UpdateWorkoutDto };
type UpdateErrors = NotFoundError;
type UpdateReturn = Effect.Effect<never, UpdateErrors, Workout>;

export const updateWorkout = ({ id, data }: UpdateArgs): UpdateReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.update({ where: { id }, data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
