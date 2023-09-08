import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { User } from '@prisma/client';
import { Filters, buildFilters } from '../../../utils';

type FilterArgs = { filters?: Filters<User> };
type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, User[]>;

export const filterUsers = ({ filters }: FilterArgs): FilterReturn => {
  const queryFilters = buildFilters(filters);
  return Effect.promise(() => prisma.user.findMany(queryFilters));
};
