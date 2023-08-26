import { Effect, pipe } from 'effect';
import { DuplicateError, InvalidDtoError } from '../../../errors/types';
import { CreateUserDto } from '../types';
import { handlePrismaErrors } from '../../../errors/handlers';
import prisma from '../../../config/prisma';
import { User } from '@prisma/client';
import { hashPassword } from '../../../lib/bcrypt';

type CreateArgs = { dto: CreateUserDto };
type CreateErrors = DuplicateError;
type CreateReturn = Effect.Effect<never, CreateErrors, User>;

export const createUser = ({ dto }: CreateArgs): CreateReturn => {
  return pipe(
    Effect.all([buildUserData(dto)]),
    Effect.flatMap(([data]) => saveUserData(data))
  );
};

const buildUserData = (dto: CreateUserDto): Effect.Effect<never, InvalidDtoError, Omit<User, 'id' | 'role'>> => {
  const { username, password } = dto;

  return pipe(
    Effect.all([hashPassword({ password })]),
    Effect.map(([passwordHash]) => ({ username, passwordHash }))
  );
};

const saveUserData = (data: Omit<User, 'id' | 'role'>): Effect.Effect<never, DuplicateError, User> => {
  return Effect.tryPromise({
    try: () => prisma.user.create({ data }),
    catch: (error) => handlePrismaErrors(error),
  });
};
