import { Option, Cause } from 'effect';
import { Response } from 'express';
import { InvalidRequestIdError } from '../types';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from '../resources/users/types';
import { HttpStatus } from '../constants';

export const handleFailureCauses = <T>(cause: Cause.Cause<T>, res: Response) => {
  const failureOption = Cause.failureOption(cause);

  Option.match(failureOption, {
    onSome: (error) => {
      handleGeneraFailureCauses(error, res);
      handleUserFailureCauses(error, res);
    },
    onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
  });
};

const handleGeneraFailureCauses = (error: unknown, res: Response) => {
  if (error instanceof InvalidRequestIdError) res.status(HttpStatus.BAD_REQUEST).send({ error });
};

const handleUserFailureCauses = (error: unknown, res: Response) => {
  if (error instanceof InvalidUserDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
  if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
  if (error instanceof DuplicateUserError) res.status(HttpStatus.CONFLICT).send({ error });
};
