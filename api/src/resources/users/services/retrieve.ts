import { Effect } from 'effect';
import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';

type RetrieveArgs = { id: number };
type RetrieveErrors = NotFoundError;
type RetrieveReturn = Effect.Effect<never, RetrieveErrors, User>;

export const retrieveUser = ({ id }: RetrieveArgs): RetrieveReturn => {
  return Effect.tryPromise({
    try: () => prisma.user.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
