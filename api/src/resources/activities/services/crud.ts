import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { CreateActivityDto, ActivityWithExercise, UpdateActivityDto } from '../types';
import { Activity } from '@prisma/client';
import { DuplicateError, NotFoundError } from '../../../errors/types';

export const activityCrudService = () => {
  type FindByIdArgs = { id: number };
  type FindByIdErrors = NotFoundError;
  type FindByIdReturn = Effect.Effect<never, FindByIdErrors, ActivityWithExercise>;

  const findById = ({ id }: FindByIdArgs): FindByIdReturn => {
    return Effect.tryPromise({
      try: () => prisma.activity.findUniqueOrThrow({ where: { id }, include: { exercise: true } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type FindByFieldsArgs = {};
  type FindByFieldsErrors = never;
  type FindByFieldsReturn = Effect.Effect<never, FindByFieldsErrors, Activity[]>;

  const findByFields = ({}: FindByFieldsArgs): FindByFieldsReturn => {
    return Effect.promise(() => prisma.activity.findMany({ include: { exercise: true } }));
  };

  type CreateArgs = { data: CreateActivityDto };
  type CreateErrors = DuplicateError;
  type CreateReturn = Effect.Effect<never, CreateErrors, Activity>;

  const create = ({ data }: CreateArgs): CreateReturn => {
    return Effect.tryPromise({
      try: () => prisma.activity.create({ data, include: { exercise: true } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type UpdateArgs = { id: number; data: UpdateActivityDto };
  type UpdateErrors = NotFoundError;
  type UpdateReturn = Effect.Effect<never, UpdateErrors, Activity>;

  const update = ({ id, data }: UpdateArgs): UpdateReturn => {
    return Effect.tryPromise({
      try: () => prisma.activity.update({ where: { id }, data, include: { exercise: true } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  type RemoveArgs = { id: number };
  type RemoveErrors = NotFoundError;
  type RemoveReturn = Effect.Effect<never, RemoveErrors, Activity>;

  const remove = ({ id }: RemoveArgs): RemoveReturn => {
    return Effect.tryPromise({
      try: () => prisma.activity.delete({ where: { id }, include: { exercise: true } }),
      catch: (error) => handlePrismaErrors(error),
    });
  };

  return { findById, findByFields, create, update, remove };
};
