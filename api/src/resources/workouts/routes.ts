import express from 'express';
import { workoutController } from './controller';
import { validateToken } from '../../middleware/auth-token';

const { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout } = workoutController();

export const workoutRouter = express.Router();

// TODO Refactor routes to match sub resources
workoutRouter.get('/:id', validateToken, findWorkout);
workoutRouter.get('/', validateToken, findAllWorkouts);
workoutRouter.post('/', validateToken, createWorkout);
workoutRouter.put('/:id', validateToken, updateWorkout);
workoutRouter.delete('/:id', validateToken, deleteWorkout);
