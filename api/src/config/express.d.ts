import { Role } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      authorizedUserId?: number;
      authorizedUserRole?: Role;
    }
  }
}

export {};
