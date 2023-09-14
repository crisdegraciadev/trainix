import { Effect } from 'effect';
import { LoginDto } from '../types';
import { InvalidDtoError } from '../../errors/types';

export const isValidLoginDto = (body: unknown): Effect.Effect<never, InvalidDtoError, LoginDto> => {
  const { email, password } = body as LoginDto;
  return !!email && !!password ? Effect.succeed({ email, password }) : Effect.fail(new InvalidDtoError({}));
};
