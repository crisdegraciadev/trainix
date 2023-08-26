import { Request, Response } from 'express';
import { isValidLoginDto } from './utils';
import { Effect, Exit, pipe } from 'effect';
import { createAccessToken } from './services/auth';
import { handleFailureCauses } from '../../errors/handlers';
import { HttpStatus } from '../../consts';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;

  const accessTokenResult = await pipe(
    Effect.all([isValidLoginDto(body)]),
    Effect.flatMap(([dto]) => createAccessToken({ dto })),
    Effect.runPromiseExit
  );

  Exit.match(accessTokenResult, {
    onSuccess: (accessToken) => res.status(HttpStatus.OK).send({ accessToken }),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

// TODO implement logout with Redis store
export const handleLogout = async (_req: Request, _res: Response): Promise<void> => {};
