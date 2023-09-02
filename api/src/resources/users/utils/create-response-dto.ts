import { User } from '@prisma/client';
import { Effect } from 'effect';
import { ResponseUserDto } from '../types';

export const createResponseUserDto = (user: User): Effect.Effect<never, never, ResponseUserDto> => {
  const { id, email, username } = user;
  return Effect.succeed({ id, email, username });
};
