import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CreateUserDto } from '../types';
import { Effect } from 'effect';
import {
  CreateUserErrors,
  FindUsersByFieldsErrors,
  FindUserByIdErrors,
  RemoveUserErrors,
  UpdateUserErrors,
} from '../types';
import { handlePrismaErrors } from '../../../errors/handlers';

export const userCrudService = () => {
  const findById = (userId: number): Effect.Effect<never, FindUserByIdErrors, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const findByFields = (): Effect.Effect<never, FindUsersByFieldsErrors, User[]> => {
    return Effect.promise(() => prisma.user.findMany());
  };

  const create = (data: CreateUserDto): Effect.Effect<never, CreateUserErrors, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.create({ data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const update = (userId: number, data: Partial<CreateUserDto>): Effect.Effect<never, UpdateUserErrors, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.update({ where: { id: userId }, data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  const remove = (userId: number): Effect.Effect<never, RemoveUserErrors, User> => {
    return Effect.tryPromise({
      try: () => prisma.user.delete({ where: { id: userId } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  return { findById, findByFields, create, update, remove };
};
