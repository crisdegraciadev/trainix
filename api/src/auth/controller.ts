import { Request, Response } from 'express';
import { isValidLoginDto } from './utils';
import { Effect, Exit, pipe } from 'effect';
import { createAccessToken } from './services/auth';
import { serialize } from 'cookie';
import { Auth, Global, HttpStatus } from '../consts';
import { transformMillisecondsToDays } from '../utils';
import { handleFailureCauses } from '../errors/handlers';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;

  console.log({ body });

  const accessTokenResult = await pipe(
    Effect.all([isValidLoginDto(body)]),
    Effect.flatMap(([dto]) => createAccessToken({ dto })),
    Effect.runPromiseExit
  );

  Exit.match(accessTokenResult, {
    onSuccess: (accessToken) => {
      const cookieOptions = {
        httpOnly: true,
        secure: Global.ENV === 'prod',
        sameSite: 'strict',
        maxAge: transformMillisecondsToDays(30),
        path: Auth.COOKIE_PATH,
      } as const;

      res.setHeader('Set-Cookie', serialize('token', accessToken, { ...cookieOptions })).sendStatus(HttpStatus.OK);
    },
    onFailure: (cause) => {
      const [errorResponse, error] = handleFailureCauses(cause, res);
      errorResponse.send({ error });
    },
  });
};

// TODO implement logout with Redis store
export const handleLogout = async (_req: Request, _res: Response): Promise<void> => {};
