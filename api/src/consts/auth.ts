import { Role } from '@prisma/client';

export const Auth = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  TIME_EXPIRATION_TOKEN: 30,
  COOKIE_PATH: '/',
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  ROLE: Role,
};
