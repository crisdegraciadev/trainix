import { Workout } from '@prisma/client';
import prisma from '../../../config/prisma';
import { DuplicateWorkoutError, InvalidWorkoutDtoError, WorkoutNotFoundError } from '../errors';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { WorkoutDto } from '../types';
import { Errors } from '../../../constants';

export const workoutCrudService = () => {
  const findById = async (workoutId: number): Promise<Workout> => {
    try {
      return await prisma.workout.findUniqueOrThrow({
        where: {
          id: workoutId,
        },
      });
    } catch (error) {
      throw new WorkoutNotFoundError();
    }
  };

  const findByFields = async (): Promise<Workout[]> => {
    return prisma.workout.findMany();
  };

  const create = async (data: WorkoutDto): Promise<Workout> => {
    try {
      return await prisma.workout.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;

        if (code === Errors.Prisma.Codes.P2002) throw new DuplicateWorkoutError();
      }

      throw error;
    }
  };

  const update = async (workoutId: number, data: WorkoutDto): Promise<Workout> => {
    try {
      return await prisma.workout.update({
        where: { id: workoutId },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;

        if (code === Errors.Prisma.Codes.P2025) throw new WorkoutNotFoundError();
      }

      if (error instanceof PrismaClientValidationError) throw new InvalidWorkoutDtoError();

      throw error;
    }
  };

  const remove = async (workoutId: number) => {
    try {
      await prisma.workout.delete({
        where: { id: workoutId },
      });
    } catch (error) {
      throw new WorkoutNotFoundError();
    }
  };

  return { findById, findByFields, create, update, remove };
};
