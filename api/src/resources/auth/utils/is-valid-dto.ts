import { Effect } from 'effect';
import { InvalidDtoError } from '../../../errors/types';
import { LoginDto } from '../types';

export const isValidLoginDto = (body: unknown): Effect.Effect<never, InvalidDtoError, LoginDto> => {
  const { email, password } = body as LoginDto;
  return !!email && !!password ? Effect.succeed({ email, password }) : Effect.fail(new InvalidDtoError({}));
};
