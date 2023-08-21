import express from 'express';
import { workoutController } from './controller';
import { validateToken } from '../../middleware/auth-token';

const { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout } = workoutController();

export const workoutRouter = express.Router();

workoutRouter.get('/:id', findWorkout);
workoutRouter.get('/', validateToken, findAllWorkouts);
workoutRouter.post('/', createWorkout);
workoutRouter.put('/:id', updateWorkout);
workoutRouter.delete('/:id', deleteWorkout);
