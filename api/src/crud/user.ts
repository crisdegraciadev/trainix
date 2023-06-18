import { User } from '@prisma/client';
import { UserDto } from '../types';
import prisma from '../config/prisma';

import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from '../errors';
import { Errors } from '../constants';

export const userCrud = () => {
  const findById = async (userId: string): Promise<User> => {
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

  const findByFields = async (): Promise<User[]> => {
    return prisma.user.findMany();
  };

  const create = async (data: UserDto): Promise<User> => {
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

  const update = async (userId: string, data: UserDto): Promise<User> => {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;

        if (code === Errors.Prisma.Codes.P2025) throw new UserNotFoundError();
      }

      if (error instanceof PrismaClientValidationError) throw new InvalidUserDtoError();

      throw error;
    }
  };

  const remove = async (userId: string) => {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new UserNotFoundError();
    }
  };

  return { findById, findByFields, create, update, remove };
};
