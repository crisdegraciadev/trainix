import express from 'express';
import { createUser, deleteUser, findAllUsers, findUser, updateUser } from '../controllers';

export const userRouter = express.Router();

userRouter.get('/:id', findUser);
userRouter.get('/', findAllUsers);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
