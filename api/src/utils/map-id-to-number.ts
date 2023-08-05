import { Effect, pipe } from 'effect';
import { InvalidRequestIdError } from '../errors/types';

export const mapIdToNumber = (id: string): Effect.Effect<never, InvalidRequestIdError, number> => {
  const mappedId = pipe(id, Number);
  return !isNaN(mappedId) ? Effect.succeed(mappedId) : Effect.fail(new InvalidRequestIdError({}));
};
