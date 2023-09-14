import express from 'express';
import { handleLogin, handleLogout } from './controller';

export const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
