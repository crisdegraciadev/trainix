import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import { UpdateUserDto } from '../types';
import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type UpdateArgs = { id: number; data: UpdateUserDto };
type UpdateErrors = NotFoundError;
type UpdateReturn = Effect.Effect<never, UpdateErrors, User>;

export const updateUser = ({ id, data }: UpdateArgs): UpdateReturn => {
  return Effect.tryPromise({
    try: () => prisma.user.update({ where: { id }, data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
