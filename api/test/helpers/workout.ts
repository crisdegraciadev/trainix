import { Workout } from '@prisma/client';
import prisma from '../../src/config/prisma';
import { CreateWorkoutDto } from '../../src/resources/workouts/types';

export type WorkoutResponse = {
  id: number;
  name: string;
  userId: string;
};

export const BASE_WORKOUT_PATH = '/workouts';

export const isValidWorkoutResponse = (body: unknown): body is WorkoutResponse => {
  const { id, name, userId } = body as WorkoutResponse;
  return !!id && !!name && !!userId;
};

export const findWorkoutById = async (id: number): Promise<Workout | null> => {
  return prisma.workout.findFirst({ where: { id } });
};

export const createWorkout = async (data: CreateWorkoutDto): Promise<Workout> => {
  return prisma.workout.create({ data });
};

export const deleteWorkout = async (id: number): Promise<Workout> => {
  return prisma.workout.delete({ where: { id } });
};

export const deleteAllWorkouts = async () => {
  const deleteWorkouts = prisma.workout.deleteMany();
  await prisma.$transaction([deleteWorkouts]);
};
