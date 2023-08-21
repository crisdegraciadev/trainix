import { Role } from '@prisma/client';

export const Auth = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
  ROLE: Role,
};
