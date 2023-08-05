import { User } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CreateUserDto, UpdateUserDto } from '../types';
import { Effect } from 'effect';
import { handlePrismaErrors } from '../../../errors/handlers';
import { DuplicateError, NotFoundError } from '../../../errors/types';

export const userCrudService = () => {
  type FindByIdArgs = { id: number };
  type FindByIdErrors = NotFoundError;
  type FindByIdReturn = Effect.Effect<never, FindByIdErrors, User>;

  const findById = ({ id }: FindByIdArgs): FindByIdReturn => {
    return Effect.tryPromise({
      try: () => prisma.user.findUniqueOrThrow({ where: { id } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type FindByFieldsArgs = {};
  type FindByFieldsErrors = never;
  type FindByFieldsReturn = Effect.Effect<never, FindByFieldsErrors, User[]>;

  const findByFields = ({}: FindByFieldsArgs): FindByFieldsReturn => {
    return Effect.promise(() => prisma.user.findMany());
  };

  type CreateArgs = { data: CreateUserDto };
  type CreateErrors = DuplicateError;
  type CreateReturn = Effect.Effect<never, CreateErrors, User>;

  const create = ({ data }: CreateArgs): CreateReturn => {
    return Effect.tryPromise({
      try: () => prisma.user.create({ data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type UpdateArgs = { id: number; data: UpdateUserDto };
  type UpdateErrors = NotFoundError;
  type UpdateReturn = Effect.Effect<never, UpdateErrors, User>;

  const update = ({ id, data }: UpdateArgs): UpdateReturn => {
    return Effect.tryPromise({
      try: () => prisma.user.update({ where: { id }, data }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type RemoveArgs = { id: number };
  type RemoveErrors = NotFoundError;
  type RemoveReturn = Effect.Effect<never, RemoveErrors, User>;

  const remove = ({ id }: RemoveArgs): RemoveReturn => {
    return Effect.tryPromise({
      try: () => prisma.user.delete({ where: { id } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  return { findById, findByFields, create, update, remove };
};
