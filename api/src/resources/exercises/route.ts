import express from 'express';
import { validateToken } from '../../middleware/auth-token';
import { hasAdminRole } from '../../middleware/role';
import {
  handleCreateExercise,
  handleDeleteExercise,
  handleFindExerciseByFields,
  handleFindExerciseById,
  handleUpdateExercise,
} from './controller';

export const exerciseRouter = express.Router();

exerciseRouter.get('/:id', validateToken, handleFindExerciseById);
exerciseRouter.get('/', validateToken, handleFindExerciseByFields);
exerciseRouter.post('/', handleCreateExercise);
exerciseRouter.put('/:id', validateToken, handleUpdateExercise);
exerciseRouter.delete('/:id', validateToken, hasAdminRole, handleDeleteExercise);
