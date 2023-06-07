import express from 'express';
import { RouteInfo } from '../types';
import { createUser, deleteUser, findAllUsers, findUser, updateUser } from '../controllers';

export const userRouter = express.Router();

const routes: RouteInfo[] = [
  { path: '/:id', verb: 'get', handler: findUser },
  { path: '/', verb: 'get', handler: findAllUsers },
  { path: '/', verb: 'post', handler: createUser },
  { path: '/:id', verb: 'put', handler: updateUser },
  { path: '/:id', verb: 'delete', handler: deleteUser },
];

routes.forEach(({ path, verb, handler }) => {
  userRouter[verb](path, handler);
});
