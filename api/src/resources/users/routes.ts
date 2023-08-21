import express from 'express';
import { validateToken } from '../../middleware/auth-token';
import { postUser, deleteUser, getUsersByFields, getUserById, putUser } from './controller';

export const userRouter = express.Router();

userRouter.get('/:id', getUserById);
userRouter.get('/', getUsersByFields);
userRouter.post('/', postUser);
userRouter.put('/:id', putUser);
userRouter.delete('/:id', deleteUser);
