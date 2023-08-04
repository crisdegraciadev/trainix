import { Effect } from 'effect';
import { CreateWorkoutDto } from '../types';
import { InvalidDtoError } from '../../../errors/types';

export const isValidCreateWorkoutDto = (body: unknown): Effect.Effect<never, InvalidDtoError, true> => {
  const { name, userId } = body as CreateWorkoutDto;
  return !!name && !!userId ? Effect.succeed(true) : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateWorkoutDto = (body: unknown): Effect.Effect<never, InvalidDtoError, true> => {
  const { name, userId } = body as CreateWorkoutDto;
  return !!name || !!userId ? Effect.succeed(true) : Effect.fail(new InvalidDtoError({}));
};
