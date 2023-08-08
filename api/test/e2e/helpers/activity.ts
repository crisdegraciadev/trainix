import { Activity } from '@prisma/client';
import prisma from '../../../src/config/prisma';
import { ActivityWithExercise, CreateActivityDto } from '../../../src/resources/activities/types';

export const BASE_ACTIVITY_PATH = '/activities';

export type ActivityResponse = {
  id: number;
  sets: number;
  reps: number;
  exerciseId: number;
  exercise: {
    id: number;
    name: string;
    description: string;
  };
};

export const isValidActivityResponse = (body: unknown): body is ActivityResponse => {
  const { id, sets, reps, exerciseId, exercise } = body as ActivityResponse;
  const hasExercise = !!exercise.id && !!exercise.name && !!exercise.description;
  return !!id && !!sets && !!reps && !!exerciseId && !!hasExercise;
};

export const findActivityById = async (id: number): Promise<Activity | null> => {
  return prisma.activity.findFirst({ where: { id } });
};

export const createActivity = async (data: CreateActivityDto): Promise<ActivityWithExercise> => {
  return prisma.activity.create({ data, include: { exercise: true } });
};

export const deleteActivity = async (id: number): Promise<Activity> => {
  return prisma.activity.delete({ where: { id } });
};
