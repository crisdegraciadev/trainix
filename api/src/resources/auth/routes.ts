import express from 'express';
import { login, logout } from './controller';

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
