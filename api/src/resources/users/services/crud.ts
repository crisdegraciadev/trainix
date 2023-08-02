import { User } from '@prisma/client';
import { DuplicateUserError, UserNotFoundError } from '../errors';
import prisma from '../../../config/prisma';
import { UserDto } from '../types';
import { Effect } from 'effect';

export const userCrudService = () => {
  const findById = (userId: number): Effect.Effect<never, UserNotFoundError, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      catch: () => new UserNotFoundError(),
    });
  };

  const findByFields = (): Effect.Effect<never, never, User[]> => {
    return Effect.promise(() => prisma.user.findMany());
  };

  const create = (data: UserDto): Effect.Effect<never, DuplicateUserError, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.create({ data }),
      catch: () => new DuplicateUserError(),
    });
  };

  const update = (userId: number, data: Partial<UserDto>): Effect.Effect<never, UserNotFoundError, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.update({ where: { id: userId }, data }),
      catch: () => new UserNotFoundError(),
    });
  };

  const remove = (userId: number): Effect.Effect<never, UserNotFoundError, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.delete({ where: { id: userId } }),
      catch: () => new UserNotFoundError(),
    });
  };

  return { findById, findByFields, create, update, remove };
};
