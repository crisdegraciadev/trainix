import { Activity } from '@prisma/client';
import prisma from '../../../src/config/prisma';
import { ActivityWithExercise, CreateActivityDto } from '../../../src/resources/activities/types';
import { deleteRequest, postRequest } from './request';

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

export const retrieveActivity = async (id: number): Promise<Activity | null> => {
  return prisma.activity.findFirst({ where: { id } });
};

export const insertActivity = async (
  dto: CreateActivityDto,
  accessTokenCookie: string
): Promise<ActivityWithExercise> => {
  const { body } = await postRequest({
    url: `${BASE_ACTIVITY_PATH}`,
    headers: { Cookie: accessTokenCookie },
    dto,
  });

  return body;
};

export const deleteActivity = async (id: number, accessTokenCookie: string): Promise<Activity> => {
  const { body } = await deleteRequest({
    url: `${BASE_ACTIVITY_PATH}/${id}`,
    headers: { Cookie: accessTokenCookie },
  });

  return body;
};
