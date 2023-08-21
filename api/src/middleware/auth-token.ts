import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../consts';
import { verifyToken } from '../lib/jwt';
import { Global } from '../consts/global';
import { UnauthorizedError } from '../errors/types/unauthorized';

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.status(HttpStatus.UNAUTHORIZED).send({ error: new UnauthorizedError({}) });

  const { id: userId } = verifyToken({ token, secret: Global.ACCESS_TOKEN_SECRET });
  req.authorizedUserId = userId;

  next();
};
