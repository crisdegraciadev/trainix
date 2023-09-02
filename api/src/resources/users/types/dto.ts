import { User } from '@prisma/client';

export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
  repeatedPassword: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type ResponseUserDto = Omit<User, 'passwordHash' | 'role'>;
