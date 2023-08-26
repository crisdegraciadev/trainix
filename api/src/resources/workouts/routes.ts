import express from 'express';
import { validateToken } from '../../middleware/auth-token';
import {
  handleCreateWorkout,
  handleFindWorkoutByFields,
  handleFindWorkoutById,
  handleDeleteWorkout,
  handleUpdateWorkout,
} from './controller';

export const workoutRouter = express.Router();

// TODO Refactor routes to match sub resources
workoutRouter.get('/:id', validateToken, handleFindWorkoutById);
workoutRouter.get('/', validateToken, handleFindWorkoutByFields);
workoutRouter.post('/', validateToken, handleCreateWorkout);
workoutRouter.put('/:id', validateToken, handleUpdateWorkout);
workoutRouter.delete('/:id', validateToken, handleDeleteWorkout);
