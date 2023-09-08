import { Effect, pipe } from 'effect';
import { DuplicateError, InvalidDtoError } from '../../../errors/types';
import { CreateUserDto } from '../types';
import { handlePrismaErrors } from '../../../errors/handlers';
import prisma from '../../../config/prisma';
import { User } from '@prisma/client';
import { hashPassword } from '../../../lib/bcrypt';

type InsertArgs = { dto: CreateUserDto };
type InsertErrors = DuplicateError;
type InsertReturn = Effect.Effect<never, InsertErrors, User>;

export const insertUser = ({ dto }: InsertArgs): InsertReturn => {
  return pipe(
    Effect.all([buildUserData(dto)]),
    Effect.flatMap(([data]) => saveUserData(data))
  );
};

const buildUserData = (dto: CreateUserDto): Effect.Effect<never, InvalidDtoError, Omit<User, 'id' | 'role'>> => {
  const { email, username, password } = dto;

  return pipe(
    Effect.all([hashPassword({ password })]),
    Effect.map(([passwordHash]) => ({ email, username, passwordHash }))
  );
};

const saveUserData = (data: Omit<User, 'id' | 'role'>): Effect.Effect<never, DuplicateError, User> => {
  return Effect.tryPromise({
    try: () => prisma.user.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
