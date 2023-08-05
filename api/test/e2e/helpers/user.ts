import { User } from '@prisma/client';
import prisma from '../../../src/config/prisma';
import { CreateUserDto } from '../../../src/resources/users/types';

export type UserResponse = {
  id: number;
  username: string;
};

export const BASE_USER_PATH = '/users';

export const isValidUserResponse = (body: unknown): body is UserResponse => {
  const { id, username } = body as UserResponse;
  return !!id && !!username;
};

export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findFirst({ where: { id } });
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  return prisma.user.create({ data });
};

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

export const deleteAllUsers = async () => {
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteUsers]);
};
