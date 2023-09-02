import { Effect } from 'effect';
import { CreateUserDto, UpdateUserDto } from '../types';
import { InvalidDtoError } from '../../../errors/types';

export const isValidCreateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateUserDto> => {
  const { email, username, password, repeatedPassword } = body as CreateUserDto;
  return !!email && !!username && !!password && !!repeatedPassword
    ? Effect.succeed({ email, username, password, repeatedPassword })
    : Effect.fail(new InvalidDtoError({}));
};

// TODO implement password change
export const isValidUpdateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateUserDto> => {
  const { username } = body as UpdateUserDto;
  return !!username ? Effect.succeed({ username }) : Effect.fail(new InvalidDtoError({}));
};
