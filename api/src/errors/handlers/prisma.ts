import { pipe, Match } from 'effect';
import { Errors } from '../../consts';
import { DuplicateError, NotFoundError, RelationError, UnknownError } from '../types';
import { Prisma } from '@prisma/client';

const { Codes } = Errors.Prisma;

export const handlePrismaErrors = (error: unknown) => {
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
