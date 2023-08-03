import { Effect, pipe } from 'effect';
import { InvalidRequestIdError } from '../errors/invalid-request-id';
import { isNumber } from 'effect/Predicate';

export const mapIdToNumber = (id: string): Effect.Effect<never, InvalidRequestIdError, number> => {
  const mappedId = pipe(id, Number);
  return isNumber(mappedId) ? Effect.succeed(mappedId) : Effect.fail(new InvalidRequestIdError());
};
