import { Activity } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';

type FilterArgs = {};
type FilterErrors = never;
type FilterReturn = Effect.Effect<never, FilterErrors, Activity[]>;

export const filterActivities = ({}: FilterArgs): FilterReturn => {
  return Effect.promise(() => prisma.activity.findMany({ include: { exercise: true } }));
};
