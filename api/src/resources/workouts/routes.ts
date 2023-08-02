import express from 'express';
import { workoutController } from './controller';

const { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout } = workoutController();

export const workoutRouter = express.Router();

workoutRouter.get('/:id', findWorkout);
workoutRouter.get('/', findAllWorkouts);
workoutRouter.post('/', createWorkout);
workoutRouter.put('/:id', updateWorkout);
workoutRouter.delete('/:id', deleteWorkout);
