import express from 'express';
import { activityController } from './controller';

const { findActivity, findAllActivities, createActivity, updateActivity, deleteActivity } = activityController();

export const userRouter = express.Router();

userRouter.get('/:id', findActivity);
userRouter.get('/', findAllActivities);
userRouter.post('/', createActivity);
userRouter.put('/:id', updateActivity);
userRouter.delete('/:id', deleteActivity);
