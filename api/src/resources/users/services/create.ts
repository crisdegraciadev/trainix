import { Effect } from 'effect';
import { DuplicateError } from '../../../errors/types';
import { CreateUserDto } from '../types';
import { handlePrismaErrors } from '../../../errors/handlers';
import prisma from '../../../config/prisma';
import { User } from '@prisma/client';

type CreateArgs = { data: CreateUserDto };
type CreateErrors = DuplicateError;
type CreateReturn = Effect.Effect<never, CreateErrors, User>;

export const create = ({ data }: CreateArgs): CreateReturn => {
  return Effect.tryPromise({
    try: () => prisma.user.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
