import { Errors } from '../constants';
import { DuplicateError, ErrorParams, NotFoundError, UnknownError } from '../types';
import { Prisma } from '@prisma/client';

const { Codes } = Errors.Prisma;

const errorCatalog = {
  [Codes.P2002]: (errorParams: ErrorParams) => new DuplicateError(errorParams),
  [Codes.P2003]: (errorParams: ErrorParams) => new NotFoundError(errorParams),
  [Codes.P2025]: (errorParams: ErrorParams) => new NotFoundError(errorParams),
};

export const handlePrismaErrors = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { code, meta } = error;

    const errorHandler = errorCatalog[code];
    return !errorHandler ? new UnknownError({ meta }) : errorHandler({ meta });
  }

  return new UnknownError({});
};
