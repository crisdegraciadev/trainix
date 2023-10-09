import { Prisma } from '@prisma/client';
import { handlePrismaErrors } from '../../../../src/errors/handlers';
import { DuplicateError, NotFoundError, RelationError, UnknownError } from '../../../../src/errors/types';
import { Errors } from '../../../../src/consts';

describe('handlePrismaErrors()', () => {
  const { Codes } = Errors.Prisma;

  it('should return DuplicateError for Prisma error with code P2002', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2002,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof DuplicateError).toBeTruthy();
  });

  it('should return RelationError for Prisma error with code P2003', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2003,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof RelationError).toBeTruthy();
  });

  it('should return RelationError for Prisma error with code P2025', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2025,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof NotFoundError).toBeTruthy();
  });

  it('should return UnknownError for unknown error', () => {
    const error = handlePrismaErrors(new Error());
    expect(error instanceof UnknownError).toBeTruthy();
  });
});
