import { User } from '@prisma/client';
import prisma from '../../src/config/prisma';
import { UserDto } from '../../src/resources/users/types';

export type UserResponse = {
  id: string;
  username: string;
};

export const isValidUserResponse = (body: unknown): body is UserResponse => {
  const { id, username } = body as UserResponse;
  return !!id && !!username;
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findFirst({ where: { id } });
};

export const createUser = async (data: UserDto): Promise<User> => {
  return prisma.user.create({ data });
};

export const deleteAllUsers = async () => {
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteUsers]);
};
