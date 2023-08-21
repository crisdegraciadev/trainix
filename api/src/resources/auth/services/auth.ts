import { Effect, pipe } from 'effect';
import { createToken } from '../../../lib/jwt';
import { LoginDto } from '../types';
import { Global } from '../../../consts/global';
import { Filters } from '../../../utils';
import { User } from '@prisma/client';
import { findUsersByFields } from '../../users/services';
import { UnauthorizedError } from '../../../errors/types/unauthorized';
import { hasSameHash } from '../../../lib/bcrypt';

type CreateAccessTokenArgs = {
  dto: LoginDto;
};

export const createAccessToken = ({ dto }: CreateAccessTokenArgs): Effect.Effect<never, UnauthorizedError, string> => {
  return pipe(
    Effect.all([checkIfUserExist(dto)]),
    Effect.flatMap(([user]) => checkUserCredentials(user, dto)),
    Effect.flatMap((payload) => createToken({ payload, secret: Global.ACCESS_TOKEN_SECRET }))
  );
};

const checkIfUserExist = (dto: LoginDto): Effect.Effect<never, UnauthorizedError, User> => {
  const { username } = dto;
  const filters: Filters<User> = { username };

  return pipe(
    Effect.all([findUsersByFields({ filters })]),
    Effect.map(([users]) => users.at(0)),
    Effect.flatMap((user) => {
      return !user ? Effect.fail(new UnauthorizedError({ message: 'No user' })) : Effect.succeed(user);
    })
  );
};

const checkUserCredentials = (user: User, dto: LoginDto): Effect.Effect<never, UnauthorizedError, User> => {
  const { username, password } = dto;
  const { passwordHash } = user;

  return pipe(
    Effect.all([Effect.succeed(user.username === username), hasSameHash({ password, passwordHash })]),
    Effect.flatMap(([isValidUsername, isSamePassword]) => {
      return !isValidUsername || !isSamePassword ? Effect.fail(new UnauthorizedError({})) : Effect.succeed(user);
    })
  );
};
