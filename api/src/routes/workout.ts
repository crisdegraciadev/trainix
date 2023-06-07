import express from 'express';
import { RouteInfo } from '../types';
import { createWorkout, deleteWorkout, findAllWorkouts, findWorkoutById, updateWorkout } from '../controllers';

export const workoutRouter = express.Router();

const routes: RouteInfo[] = [
  { path: '/:id', verb: 'get', handler: findWorkoutById },
  { path: '/', verb: 'get', handler: findAllWorkouts },
  { path: '/', verb: 'post', handler: createWorkout },
  { path: '/:id', verb: 'put', handler: updateWorkout },
  { path: '/:id', verb: 'delete', handler: deleteWorkout },
];

routes.forEach(({ path, verb, handler }) => {
  workoutRouter[verb](path, handler);
});
