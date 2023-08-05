import { Effect } from 'effect';
import { InvalidDtoError } from '../../../errors/types';
import { CreateActivityDto, UpdateActivityDto } from '../types';

export const isValidCreateActivityDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateActivityDto> => {
  const { sets, reps, exerciseId } = body as CreateActivityDto;

  return !!sets && !!reps && !!exerciseId
    ? Effect.succeed({ sets, reps, exerciseId })
    : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateActivityDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateActivityDto> => {
  const { sets, reps, exerciseId } = body as UpdateActivityDto;
  return !!sets || !!reps || !!exerciseId
    ? Effect.succeed({ sets, reps, exerciseId })
    : Effect.fail(new InvalidDtoError({}));
};
