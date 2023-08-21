import express from 'express';
import { activityController } from './controller';
import { validateToken } from '../../middleware/auth-token';

const { findActivity, findAllActivities, createActivity, updateActivity, deleteActivity } = activityController();

export const activitiesRouter = express.Router();

activitiesRouter.get('/:id', validateToken, findActivity);
activitiesRouter.get('/', validateToken, findAllActivities);
activitiesRouter.post('/', validateToken, createActivity);
activitiesRouter.put('/:id', validateToken, updateActivity);
activitiesRouter.delete('/:id', validateToken, deleteActivity);
