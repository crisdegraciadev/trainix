import { Effect } from 'effect';
import { InvalidDtoError } from '../../../errors/types';
import { LoginDto } from '../types';

export const isValidLoginDto = (body: unknown): Effect.Effect<never, InvalidDtoError, LoginDto> => {
  const { username, password } = body as LoginDto;
  return !!username && !!password ? Effect.succeed({ username, password }) : Effect.fail(new InvalidDtoError({}));
};
