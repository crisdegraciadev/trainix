import { Effect } from 'effect';
import { CreateUserDto, InvalidUserDtoError, UpdateUserDto } from '../types';

export const isValidCreateUserDto = (body: unknown): Effect.Effect<never, InvalidUserDtoError, true> => {
  const { username } = body as CreateUserDto;
  return !!username ? Effect.succeed(true) : Effect.fail(new InvalidUserDtoError());
};

export const isValidUpdateUserDto = (body: unknown): Effect.Effect<never, InvalidUserDtoError, true> => {
  const { username } = body as UpdateUserDto;
  return !!username ? Effect.succeed(true) : Effect.fail(new InvalidUserDtoError());
};
