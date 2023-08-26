import { Option, Cause, Match, pipe, Effect } from 'effect';
import { Response } from 'express';
import { DuplicateError, InvalidDtoError, InvalidRequestIdError, NotFoundError, RelationError } from '../types';
import { UnauthorizedError } from '../types/unauthorized';
import { HttpStatus } from '../../consts';

export const handleFailureCauses = (cause: Cause.Cause<Error>, res: Response) => {
  const failureOption = Cause.failureOption(cause);

  const getStatusCode = pipe(
    Match.type<{ error: Error }>(),
    Match.when({ error: (error) => error instanceof InvalidRequestIdError }, () => HttpStatus.BAD_REQUEST),
    Match.when({ error: (error) => error instanceof InvalidDtoError }, () => HttpStatus.BAD_REQUEST),
    Match.when({ error: (error) => error instanceof NotFoundError }, () => HttpStatus.NOT_FOUND),
    Match.when({ error: (error) => error instanceof UnauthorizedError }, () => HttpStatus.UNAUTHORIZED),
    Match.when({ error: (error) => error instanceof DuplicateError }, () => HttpStatus.CONFLICT),
    Match.when({ error: (error) => error instanceof RelationError }, () => HttpStatus.CONFLICT),
    Match.orElse(() => HttpStatus.INTERNAL_SERVER_ERROR),
  );

  Option.match(failureOption, {
    onSome: (error) => res.status(getStatusCode({ error })).send({ error }),
    onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
  });
};
