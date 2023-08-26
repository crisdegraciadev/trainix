import { Effect } from 'effect';
import { NotFoundError } from '../../../errors/types';
import { Activity } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type RemoveArgs = { id: number };
type RemoveErrors = NotFoundError;
type RemoveReturn = Effect.Effect<never, RemoveErrors, Activity>;

export const deleteActivity = ({ id }: RemoveArgs): RemoveReturn => {
  return Effect.tryPromise({
    try: () => prisma.activity.delete({ where: { id }, include: { exercise: true } }),
    catch: (error) => handlePrismaErrors(error),
  });
};
