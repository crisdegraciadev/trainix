import { Activity } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { DuplicateError } from '../../../errors/types';
import { CreateActivityDto } from '../types';

type CreateArgs = { data: CreateActivityDto };
type CreateErrors = DuplicateError;
type CreateReturn = Effect.Effect<never, CreateErrors, Activity>;

export const createActivity = ({ data }: CreateArgs): CreateReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.create({ data, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
