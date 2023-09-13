import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { Prisma, User } from '@prisma/client';
import { UserFacetedFilter } from '../types';

type FilterArgs = { facetedFilters?: UserFacetedFilter };
type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, User[]>;

export const filterUsers = ({ facetedFilters }: FilterArgs): FilterReturn => {
  const filters = facetedFilters ? buildFilters(facetedFilters) : {};
  return Effect.promise(() => prisma.user.findMany({ where: filters }));
};

const buildFilters = ({ username, email }: UserFacetedFilter): Prisma.UserWhereInput => {
  return {
    username,
    email,
  };
};
