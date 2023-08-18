import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { User } from '@prisma/client';
import { Filters, buildFilters } from '../../../utils';

type FindByFieldsArgs = { filters?: Filters<User> };
type FindByFieldsErrors = never;
type FindByFieldsReturn = Effect.Effect<never, FindByFieldsErrors, User[]>;

export const findUsersByFields = ({ filters }: FindByFieldsArgs): FindByFieldsReturn => {
  const queryFilters = buildFilters(filters);
  return Effect.promise(() => prisma.user.findMany(queryFilters));
};
