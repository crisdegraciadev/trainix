import { Effect, pipe } from 'effect';
import { LoginDto } from '../types';
import { User } from '@prisma/client';
import { Auth } from '../../consts';
import { UnauthorizedError } from '../../errors/types';
import { hasSameHash } from '../../lib/bcrypt';
import { createToken } from '../../lib/jwt';
import { filterUsers } from '../../resources/users/services';
import { UserFacetedFilter } from '../../resources/users/types';

type CreateAccessTokenArgs = {
  dto: LoginDto;
};

export const createAccessToken = ({ dto }: CreateAccessTokenArgs): Effect.Effect<never, UnauthorizedError, string> => {
  return pipe(
    Effect.all([checkIfUserExist(dto)]),
    Effect.flatMap(([user]) => checkUserCredentials(user, dto)),
    Effect.flatMap((payload) => createToken({ payload, secret: Auth.ACCESS_TOKEN_SECRET }))
  );
};

const checkIfUserExist = (dto: LoginDto): Effect.Effect<never, UnauthorizedError, User> => {
  const { email } = dto;
  const facetedFilters: UserFacetedFilter = { email };

  return pipe(
    Effect.all([filterUsers({ facetedFilters })]),
    Effect.map(([users]) => users.at(0)),
    Effect.flatMap((user) => {
      return !user ? Effect.fail(new UnauthorizedError({ message: 'No user' })) : Effect.succeed(user);
    })
  );
};

const checkUserCredentials = (user: User, dto: LoginDto): Effect.Effect<never, UnauthorizedError, User> => {
  const { email, password } = dto;
  const { passwordHash } = user;

  return pipe(
    Effect.all([Effect.succeed(user.email === email), hasSameHash({ password, passwordHash })]),
    Effect.flatMap(([isValidUsername, isSamePassword]) => {
      return !isValidUsername || !isSamePassword ? Effect.fail(new UnauthorizedError({})) : Effect.succeed(user);
    })
  );
};
