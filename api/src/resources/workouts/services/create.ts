import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { DuplicateError } from '../../../errors/types';
import { CreateWorkoutDto } from '../types';

type CreateArgs = { data: CreateWorkoutDto };
type CreateErrors = DuplicateError;
type CreateReturn = Effect.Effect<never, CreateErrors, Workout>;

export const createWorkout = ({ data }: CreateArgs): CreateReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
