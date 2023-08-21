import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/types';
import { HttpStatus } from '../consts';

export const hasAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const { authorizedUserRole } = req;

  if (!authorizedUserRole) {
    return res.status(HttpStatus.FORBIDDEN).send({ error: new ForbiddenError({}) });
  }

  if (authorizedUserRole !== 'ADMIN') {
    return res.status(HttpStatus.FORBIDDEN).send({ error: new ForbiddenError({}) });
  }

  next();
};
