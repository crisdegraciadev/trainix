import express from 'express';
import { createUser, deleteUser, findAllUsers, findUserById, updateUser } from '../controllers/user-controller';
import { RouteInfo } from '../types';

export const userRouter = express.Router();

const routes: RouteInfo[] = [
  { path: '/:id', verb: 'get', handler: findUserById },
  { path: '/', verb: 'get', handler: findAllUsers },
  { path: '/', verb: 'post', handler: createUser },
  { path: '/:id', verb: 'put', handler: updateUser },
  { path: '/:id', verb: 'delete', handler: deleteUser },
];

routes.forEach(({ path, verb, handler }) => {
  userRouter[verb](path, handler);
});
