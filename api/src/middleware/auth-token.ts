import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';
import { Auth, HttpStatus } from '../consts';
import { UnauthorizedError } from '../errors/types';

export const validateToken = (req: Request, res: Response, next: NextFunction): unknown => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send({ error: new UnauthorizedError({}) });
  }

  const { id: userId, role } = verifyToken({ token, secret: Auth.ACCESS_TOKEN_SECRET });
  req.authorizedUserId = userId;
  req.authorizedUserRole = role;

  next();
};
