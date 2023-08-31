import { pipe, Match } from 'effect';
import { BaseError, DuplicateError, NotFoundError, RelationError, UnknownError } from '../types';
import { Prisma } from '@prisma/client';
import { Errors } from '../../consts';

const { Codes } = Errors.Prisma;

export const handlePrismaErrors = (error: unknown): BaseError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { code, meta } = error;
    return pipe(
      Match.value(code),
      Match.when(Codes.P2002, () => new DuplicateError({ meta })),
      Match.when(Codes.P2003, () => new RelationError({ meta })),
      Match.when(Codes.P2025, () => new NotFoundError({ meta })),
      Match.orElse(() => new UnknownError({ meta }))
    );
  }

  return new UnknownError({});
};
