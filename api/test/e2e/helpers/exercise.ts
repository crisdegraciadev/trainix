import { Difficulty, Exercise, Muscle } from '@prisma/client';
import { CreateExerciseDto } from '../../../src/resources/exercises/types';
import { deleteRequest, getRequest, postRequest } from './request';

export type ExerciseResponse = {
  id: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};

export const BASE_EXERCISE_PATH = '/exercises';

export const isValidExerciseResponse = (body: unknown): body is ExerciseResponse => {
  const { id, name, description, difficulty, muscles } = body as ExerciseResponse;
  return !!id && !!name && !!description && !!difficulty && !!muscles;
};

export const retrieveExercise = async (id: number, accessTokenCookie: string): Promise<Exercise> => {
  const { body } = await getRequest({
    url: `${BASE_EXERCISE_PATH}/${id}`,
    headers: { Cookie: accessTokenCookie },
  });

  return body;
};

export const insertExercise = async (dto: CreateExerciseDto, accessTokenCookie: string): Promise<Exercise> => {
  const { body } = await postRequest({
    url: `${BASE_EXERCISE_PATH}`,
    headers: { Cookie: accessTokenCookie },
    dto,
  });

  return body;
};

export const deleteExercise = async (id: number, accessTokenCookie: string): Promise<ExerciseResponse> => {
  const { body } = await deleteRequest({
    url: `${BASE_EXERCISE_PATH}/${id}`,
    headers: { Cookie: accessTokenCookie },
  });

  return body;
};
