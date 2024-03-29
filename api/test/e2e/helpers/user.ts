import request from 'supertest';

import app from '../../../src/app';
import { User } from '@prisma/client';
import prisma from '../../../src/config/prisma';
import { CreateUserDto } from '../../../src/resources/users/types';
import { HttpStatus } from '../../../src/consts';
import { Effect } from 'effect';
import { hashPassword } from '../../../src/lib/bcrypt';

export type UserResponse = {
  id: number;
  username: string;
};

export const BASE_USER_PATH = '/users';

export const isValidUserResponse = (body: unknown): body is UserResponse => {
  const { id, username } = body as UserResponse;
  return !!id && !!username;
};

export const retrieveUser = async (id: number): Promise<User | null> => {
  return prisma.user.findFirst({ where: { id } });
};

export const insertUser = async (dto: CreateUserDto): Promise<UserResponse> => {
  const { statusCode, body } = await request(app).post(`${BASE_USER_PATH}/`).send(dto);

  expect(statusCode).toBe(HttpStatus.CREATED);
  expect(isValidUserResponse(body)).toBeTruthy();

  return body;
};

export const insertAdminUser = async (): Promise<User> => {
  return prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@admin.com',
      passwordHash: Effect.runSync(hashPassword({ password: 'admin' })),
      role: 'admin',
    },
  });
};

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

export const deleteAllUsers = async (): Promise<void> => {
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteUsers]);
};
