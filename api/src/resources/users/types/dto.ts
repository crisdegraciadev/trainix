import { User } from '@prisma/client';

export type CreateUserDto = {
  username: string;
  password: string;
  repeatedPassword: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type ResponseUserDto = Omit<User, 'passwordHash' | 'role'>;
