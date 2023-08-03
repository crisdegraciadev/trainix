import { Workout } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CreateWorkoutDto, CreateWorkoutErrors, FindWorkoutByIdErrors, UpdateWorkoutErrors } from '../types';
import { Effect } from 'effect';
import { NotFoundError } from '../../../types';
import { handlePrismaErrors } from '../../../errors';

export const workoutCrudService = () => {
  const findById = (workoutId: number): Effect.Effect<never, FindWorkoutByIdErrors, Workout> => {
    return Effect.tryPromise({
      try: () => prisma.workout.findUniqueOrThrow({ where: { id: workoutId } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const findByFields = (): Effect.Effect<never, never, Workout[]> => {
    return Effect.promise(() => prisma.workout.findMany());
  };

  const create = (data: CreateWorkoutDto): Effect.Effect<never, CreateWorkoutErrors, Workout> => {
    return Effect.tryPromise({
      try: () => prisma.workout.create({ data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const update = (workoutId: number, data: CreateWorkoutDto): Effect.Effect<never, UpdateWorkoutErrors, Workout> => {
    return Effect.tryPromise({
      try: () => prisma.workout.update({ where: { id: workoutId }, data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const remove = async (workoutId: number) => {
    try {
      await prisma.workout.delete({
        where: { id: workoutId },
      });
    } catch (error) {
      throw new NotFoundError({});
    }
  };

  return { findById, findByFields, create, update, remove };
};
