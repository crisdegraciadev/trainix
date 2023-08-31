import { User } from '@prisma/client';
import { Effect } from 'effect';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/types';
import { transformMillisecondsToDays } from '../utils';
import { Auth } from '../consts';

type CreateTokenArgs = {
  payload: Partial<User>;
  secret: string;
};

export const createToken = ({ payload, secret }: CreateTokenArgs): Effect.Effect<never, never, string> => {
  const { TIME_EXPIRATION_TOKEN } = Auth;
  return Effect.succeed(jwt.sign(payload, secret, { expiresIn: transformMillisecondsToDays(TIME_EXPIRATION_TOKEN) }));
};

type VerifyTokenArgs = {
  token: string;
  secret: string;
};

type Payload = Partial<User> & JwtPayload;

export const verifyToken = ({ token, secret }: VerifyTokenArgs): Payload => {
  const payload = jwt.verify(token, secret);
  if (!isJwtPayload(payload)) {
    throw new UnauthorizedError({});
  }

  return payload;
};

const isJwtPayload = (payload: string | JwtPayload): payload is Payload => {
  return !!(payload as Payload).id && !!(payload as Payload).username;
};
