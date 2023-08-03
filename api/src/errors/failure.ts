import { Option, Cause } from 'effect';
import { Response } from 'express';
import { DuplicateError, NotFoundError, InvalidRequestIdError } from '../types';
import { HttpStatus } from '../constants';
import { InvalidDtoError } from '../types/errors/invalid-dto';

export const handleFailureCauses = <T>(cause: Cause.Cause<T>, res: Response) => {
  const failureOption = Cause.failureOption(cause);

  Option.match(failureOption, {
    onSome: (error) => {
      if (error instanceof InvalidRequestIdError) res.status(HttpStatus.BAD_REQUEST).send({ error });
      if (error instanceof InvalidDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
      if (error instanceof NotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
      if (error instanceof DuplicateError) res.status(HttpStatus.CONFLICT).send({ error });
    },
    onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
  });
};
