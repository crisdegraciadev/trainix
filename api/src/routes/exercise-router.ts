import express from 'express';
import { RouteInfo } from '../types';
import {
  createExercise,
  deleteExercise,
  findAllExercises,
  findExerciseById,
  updateExercise,
} from '../controllers/exercise-controller';

export const exerciseRouter = express.Router();

const routes: RouteInfo[] = [
  { path: '/:id', verb: 'get', handler: findExerciseById },
  { path: '/', verb: 'get', handler: findAllExercises },
  { path: '/', verb: 'post', handler: createExercise },
  { path: '/:id', verb: 'put', handler: updateExercise },
  { path: '/:id', verb: 'delete', handler: deleteExercise },
];

routes.forEach(({ path, verb, handler }) => {
  exerciseRouter[verb](path, handler);
});
