import { User } from '@prisma/client';
import { Effect } from 'effect';
import { ResponseUserDto } from '../types';

export const createResponseUserDto = (user: User): Effect.Effect<never, never, ResponseUserDto> => {
  const { id, username, ...rest } = user;
  return Effect.succeed({ id, username });
};
