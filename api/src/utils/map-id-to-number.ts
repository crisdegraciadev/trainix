import { Effect, pipe } from 'effect';
import { isNumber } from 'effect/Predicate';
import { InvalidRequestIdError } from '../types';

export const mapIdToNumber = (id: string): Effect.Effect<never, InvalidRequestIdError, number> => {
  const mappedId = pipe(id, Number);
  return isNumber(mappedId) ? Effect.succeed(mappedId) : Effect.fail(new InvalidRequestIdError({}));
};
