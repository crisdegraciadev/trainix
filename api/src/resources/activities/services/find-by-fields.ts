import { Activity } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';

type FindByFieldsArgs = {};
type FindByFieldsErrors = never;
type FindByFieldsReturn = Effect.Effect<never, FindByFieldsErrors, Activity[]>;

export const findActivityByFields = ({}: FindByFieldsArgs): FindByFieldsReturn => {
  return Effect.promise(() => prisma.activity.findMany({ include: { exercise: true } }));
};
