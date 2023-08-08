import express from 'express';
import { activityController } from './controller';

const { findActivity, findAllActivities, createActivity, updateActivity, deleteActivity } = activityController();

export const activitiesRouter = express.Router();

activitiesRouter.get('/:id', findActivity);
activitiesRouter.get('/', findAllActivities);
activitiesRouter.post('/', createActivity);
activitiesRouter.put('/:id', updateActivity);
activitiesRouter.delete('/:id', deleteActivity);
