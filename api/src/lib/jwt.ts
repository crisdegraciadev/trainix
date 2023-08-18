import { User } from '@prisma/client';
import { Effect } from 'effect';
import jwt, { VerifyCallback } from 'jsonwebtoken';

type CreateTokenProps = {
  payload: Partial<User>;
  secret: string;
};

export const createToken = ({ payload, secret }: CreateTokenProps): Effect.Effect<never, never, string> => {
  return Effect.succeed(jwt.sign(payload, secret));
};

type VerifyTokenProps = {
  token: string;
  secret: string;
};

export const verifyToken = ({ token, secret }: VerifyTokenProps) => {
  const payload = jwt.verify(token, secret);
};
