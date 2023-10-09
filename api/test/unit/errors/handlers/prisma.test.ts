import { Prisma } from '@prisma/client';
import { handlePrismaErrors } from '../../../../src/errors/handlers';
import { DuplicateError, NotFoundError, RelationError, UnknownError } from '../../../../src/errors/types';
import { Errors } from '../../../../src/consts';

describe('handlePrismaErrors()', () => {
  const { Codes } = Errors.Prisma;

  it('P2002', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2002,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof DuplicateError).toBeTruthy();
  });

  it('P2003', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2003,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof RelationError).toBeTruthy();
  });

  it('P2025', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('', {
      code: Codes.P2025,
      clientVersion: '',
      meta: {},
      batchRequestIdx: 0,
    });

    const error = handlePrismaErrors(prismaError);
    expect(error instanceof NotFoundError).toBeTruthy();
  });

  it('unknown', () => {
    const error = handlePrismaErrors(new Error());
    expect(error instanceof UnknownError).toBeTruthy();
  });
});
