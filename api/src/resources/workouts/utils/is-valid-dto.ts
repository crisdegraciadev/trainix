import { Effect } from 'effect';
import { CreateWorkoutDto, UpdateWorkoutDto } from '../types';
import { InvalidDtoError } from '../../../errors/types';

export const isValidCreateWorkoutDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateWorkoutDto> => {
  const { name, userId } = body as CreateWorkoutDto;
  return !!name && !!userId ? Effect.succeed({ name, userId }) : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateWorkoutDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateWorkoutDto> => {
  const { name, userId } = body as CreateWorkoutDto;
  return !!name || !!userId ? Effect.succeed({ name, userId }) : Effect.fail(new InvalidDtoError({}));
};
