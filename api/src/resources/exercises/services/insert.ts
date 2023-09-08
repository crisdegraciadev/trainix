import { Effect } from 'effect';
import { DuplicateError } from '../../../errors/types';
import { CreateExerciseDto } from '../types';
import { Exercise } from '@prisma/client';
import prisma from '../../../config/prisma';
import { handlePrismaErrors } from '../../../errors/handlers';

type InsertArgs = { data: CreateExerciseDto };
type InsertErrors = DuplicateError;
type InsertReturn = Effect.Effect<never, InsertErrors, Exercise>;

export const insertExercise = ({ data }: InsertArgs): InsertReturn => {
  return Effect.tryPromise({
    try: () => prisma.exercise.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
