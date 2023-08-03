import { Effect } from 'effect';
import { CreateUserDto, UpdateUserDto } from '../types';
import { InvalidDtoError } from '../../../types/errors/invalid-dto';

export const isValidCreateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, true> => {
  const { username } = body as CreateUserDto;
  return !!username ? Effect.succeed(true) : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, true> => {
  const { username } = body as UpdateUserDto;
  return !!username ? Effect.succeed(true) : Effect.fail(new InvalidDtoError({}));
};
