import { Cause } from 'effect';
import {
  DuplicateError,
  InvalidDtoError,
  InvalidRequestIdError,
  NotFoundError,
  RelationError,
  UnauthorizedError,
} from '../../../../src/errors/types';
import { handleFailureCauses } from '../../../../src/errors/handlers';
import { response } from 'express';
import { HttpStatus } from '../../../../src/consts';

describe('handleFailureCauses()', () => {
  it('invalidRequestIdError', () => {
    const cause = Cause.fail(new InvalidRequestIdError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('invalidDtoError', () => {
    const cause = Cause.fail(new InvalidDtoError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('notFoundError', () => {
    const cause = Cause.fail(new NotFoundError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('unauthorizedError', () => {
    const cause = Cause.fail(new UnauthorizedError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('duplicateError', () => {
    const cause = Cause.fail(new DuplicateError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('relationError', () => {
    const cause = Cause.fail(new RelationError({}));
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.CONFLICT);
  });

  it('unknown', () => {
    const cause = Cause.fail(new Error());
    const [{ statusCode }] = handleFailureCauses(cause, response);
    expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
