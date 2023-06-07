import { User } from '@prisma/client';
import { UserDto } from '../types';
import prisma from '../config/prisma';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Errors } from '../constants/error';
import { DuplicateUserError, UserNotFoundError } from '../errors';

export const findUserById = async (userId: string): Promise<User> => {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new UserNotFoundError();
  }
};

export const findUsersByFields = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const saveUser = async (data: UserDto): Promise<User> => {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      const { code } = error;

      if (code === Errors.Prisma.Codes.P2002) throw new DuplicateUserError();
    }

    throw error;
  }
};
