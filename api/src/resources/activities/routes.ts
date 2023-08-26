import express from 'express';
import { validateToken } from '../../middleware/auth-token';
import {
  handleCreateActivity,
  handleDeleteActivity,
  handleFindActivityByFields,
  handleFindActivityById,
  handleUpdateActivity,
} from './controller';

export const activitiesRouter = express.Router();

activitiesRouter.get('/:id', validateToken, handleFindActivityById);
activitiesRouter.get('/', validateToken, handleFindActivityByFields);
activitiesRouter.post('/', validateToken, handleCreateActivity);
activitiesRouter.put('/:id', validateToken, handleUpdateActivity);
activitiesRouter.delete('/:id', validateToken, handleDeleteActivity);
