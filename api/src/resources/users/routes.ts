import express from 'express';
import { userController } from './controller';

const { findUser, findAllUsers, createUser, updateUser, deleteUser } = userController();

export const userRouter = express.Router();

userRouter.get('/:id', findUser);
userRouter.get('/', findAllUsers);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
