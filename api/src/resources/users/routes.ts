import express from 'express';
import {
  handleCreateUser,
  handleDeleteUser,
  handleFindUserByFields,
  handleFindUserById,
  handleUpdateUser,
} from './controller';
import { validateToken } from '../../middleware/auth-token';
import { hasAdminRole } from '../../middleware/role';

export const userRouter = express.Router();

userRouter.get('/:id', validateToken, handleFindUserById);
userRouter.get('/', validateToken, handleFindUserByFields);
userRouter.post('/', handleCreateUser);
userRouter.put('/:id', validateToken, handleUpdateUser);
userRouter.delete('/:id', validateToken, hasAdminRole, handleDeleteUser);
