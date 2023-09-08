import { Activity } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { DuplicateError } from '../../../errors/types';
import { CreateActivityDto } from '../types';

type InsertArgs = { data: CreateActivityDto };
type InsertErrors = DuplicateError;
type InsertReturn = Effect.Effect<never, InsertErrors, Activity>;

export const insertActivity = ({ data }: InsertArgs): InsertReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.create({ data, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
