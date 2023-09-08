import { Effect } from 'effect';
import { InvalidDtoError } from '../../../errors/types';
import { CreateExerciseDto, UpdateExerciseDto } from '../types';

export const isValidCreateExerciseDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateExerciseDto> => {
  const { name, description, difficulty, muscles } = body as CreateExerciseDto;
  return !!name && !!description && !!difficulty && !!muscles
    ? Effect.succeed({ name, description, difficulty, muscles })
    : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateExerciseDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateExerciseDto> => {
  const { name, description, difficulty, muscles } = body as CreateExerciseDto;
  return !!name || !!description || !!difficulty || !!muscles
    ? Effect.succeed({ name, description, difficulty, muscles })
    : Effect.fail(new InvalidDtoError({}));
};
