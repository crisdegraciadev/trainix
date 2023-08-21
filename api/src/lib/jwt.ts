import { User } from '@prisma/client';
import { Effect } from 'effect';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/types';

type CreateTokenArgs = {
  payload: Partial<User>;
  secret: string;
};

export const createToken = ({ payload, secret }: CreateTokenArgs): Effect.Effect<never, never, string> => {
  return Effect.succeed(jwt.sign(payload, secret));
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
