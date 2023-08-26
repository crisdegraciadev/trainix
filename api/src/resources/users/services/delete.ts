import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

export type RemoveArgs = { id: number };
type RemoveErrors = NotFoundError;
type RemoveReturn = Effect.Effect<never, RemoveErrors, User>;

export const deleteUser = ({ id }: RemoveArgs): RemoveReturn => {
  return Effect.tryPromise({
    try: () => prisma.user.delete({ where: { id } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
