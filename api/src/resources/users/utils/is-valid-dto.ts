import { Effect } from 'effect';
import { CreateUserDto, UpdateUserDto } from '../types';
import { InvalidDtoError } from '../../../errors/types';

export const isValidCreateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, CreateUserDto> => {
  const { email, username, password, repeatedPassword } = body as CreateUserDto;

  const requiredFieldsPresent = !!email && !!username && !!password && !!repeatedPassword;
  const passwordsMatch = password === repeatedPassword;

  return requiredFieldsPresent && passwordsMatch
    ? Effect.succeed({ email, username, password, repeatedPassword })
    : Effect.fail(new InvalidDtoError({}));
};

// TODO implement password change
export const isValidUpdateUserDto = (body: unknown): Effect.Effect<never, InvalidDtoError, UpdateUserDto> => {
  const { username, email } = body as UpdateUserDto;
  return !!username || !!email ? Effect.succeed({ username, email }) : Effect.fail(new InvalidDtoError({}));
};
