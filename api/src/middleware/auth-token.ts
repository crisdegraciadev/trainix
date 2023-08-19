import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../consts';
import { verifyToken } from '../lib/jwt';
import { Global } from '../consts/global';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.sendStatus(HttpStatus.UNAUTHORIZED);

  const { id: userId } = verifyToken({ token, secret: Global.ACCESS_TOKEN_SECRET });

  console.log({ userId });

  req.authorizedUserId = userId;

  next();
};
