import { Effect } from 'effect';
import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';

type FindByIdArgs = { id: number };
type FindByIdErrors = NotFoundError;
type FindByIdReturn = Effect.Effect<never, FindByIdErrors, User>;

export const findUserById = ({ id }: FindByIdArgs): FindByIdReturn => {
  return Effect.tryPromise({
    try: () => prisma.user.findUniqueOrThrow({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
