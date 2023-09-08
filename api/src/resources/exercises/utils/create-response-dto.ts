import { Exercise } from '@prisma/client';
import { Effect } from 'effect';
import { ResponseExerciseDto } from '../types';

export const createResponseExerciseDto = (exercise: Exercise): Effect.Effect<never, never, ResponseExerciseDto> => {
  return Effect.succeed({ ...exercise });
};
