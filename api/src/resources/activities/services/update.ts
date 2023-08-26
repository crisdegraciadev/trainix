import { Activity } from '@prisma/client';
import { Effect } from 'effect';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';
import { NotFoundError } from '../../../errors/types';
import { UpdateActivityDto } from '../types';

type UpdateArgs = { id: number; data: UpdateActivityDto };
type UpdateErrors = NotFoundError;
type UpdateReturn = Effect.Effect<never, UpdateErrors, Activity>;

export const updateActivity = ({ id, data }: UpdateArgs): UpdateReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.update({ where: { id }, data, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
