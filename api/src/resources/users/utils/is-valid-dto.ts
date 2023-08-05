import { Effect } from 'effect';
import { CreateUserDto, UpdateUserDto } from '../types';
import { InvalidDtoError } from '../../../errors/types';

export const isValidCreateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateUserDto> => {
  const { username } = body as CreateUserDto;
  return !!username ? Effect.succeed({ username }) : Effect.fail(new InvalidDtoError({}));
};

export const isValidUpdateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateUserDto> => {
  const { username } = body as UpdateUserDto;
  return !!username ? Effect.succeed({ username }) : Effect.fail(new InvalidDtoError({}));
};
