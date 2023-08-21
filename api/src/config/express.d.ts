import { Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      authorizedUserId?: number;
      authorizedUserRole?: Role;
    }
  }
}

export {};
