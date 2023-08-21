import express from 'express';
import { postUser, deleteUser, getUsersByFields, getUserById, putUser } from './controller';
import { validateToken } from '../../middleware/auth-token';
import { hasAdminRole } from '../../middleware/role';

export const userRouter = express.Router();

userRouter.get('/:id', validateToken, getUserById);
userRouter.get('/', validateToken, getUsersByFields);
userRouter.post('/', postUser);
userRouter.put('/:id', validateToken, putUser);
userRouter.delete('/:id', validateToken, hasAdminRole, deleteUser);
