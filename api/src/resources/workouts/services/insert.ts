import { Workout } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { DuplicateError } from '../../../errors/types';
import { CreateWorkoutDto } from '../types';

type InsertArgs = { data: CreateWorkoutDto };
type InsertErrors = DuplicateError;
type InsertReturn = Effect.Effect<never, InsertErrors, Workout>;

export const insertWorkout = ({ data }: InsertArgs): InsertReturn => {
  return Effect.tryPromise({
    try: () => prisma.workout.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
