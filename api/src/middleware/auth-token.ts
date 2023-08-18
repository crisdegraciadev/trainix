import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../consts';
import { verifyToken } from '../lib/jwt';
import { Global } from '../consts/global';

type ReqProps = {
  user: string;
};

export const authenticateToken = (req: Request<ReqProps>, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.sendStatus(HttpStatus.UNAUTHORIZED);

  const user = verifyToken({ token, secret: Global.ACCESS_TOKEN_SECRET });
};
