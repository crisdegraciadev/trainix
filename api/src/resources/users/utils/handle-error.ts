import { Cause, Option } from 'effect';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from '../errors';
import { HttpStatus } from '../../../constants';
import { Response } from 'express';

export const handleUserErrors = (cause: Cause.Cause<InvalidUserDtoError | DuplicateUserError>, res: Response) => {
  Option.match(Cause.failureOption(cause), {
    onSome: (error) => {
      if (error instanceof InvalidUserDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
      if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
      if (error instanceof DuplicateUserError) res.status(HttpStatus.CONFLICT).send({ error });
    },
    onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
  });
};
