import { Request, Response } from 'express';
import { workoutCrudService } from './services';
import { HttpStatus } from '../../constants';
import { DuplicateWorkoutError, InvalidWorkoutDtoError, WorkoutNotFoundError } from './errors';
import { isValidWorkoutDto } from './utils';

export type WorkoutRequestParams = {
  id: number;
};

export const workoutController = () => {
  const { findById, findByFields, create, update, remove } = workoutCrudService();

  const findWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id: workoutId } = req.params;

    try {
      const workout = await findById(Number(workoutId));

      res.status(HttpStatus.OK).send(workout);
    } catch (error) {
      if (error instanceof WorkoutNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
    }
  };

  const findAllWorkouts = async (_req: Request, res: Response) => {
    const workouts = await findByFields();
    res.status(HttpStatus.OK).send(workouts);
  };

  const createWorkout = async (req: Request, res: Response) => {
    try {
      const { body } = req;

      if (!isValidWorkoutDto(body)) {
        throw new InvalidWorkoutDtoError();
      }

      const workout = await create(body);

      res.status(HttpStatus.CREATED).send(workout);
    } catch (error) {
      if (error instanceof InvalidWorkoutDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
      if (error instanceof DuplicateWorkoutError) res.status(HttpStatus.CONFLICT).send({ error });
    }
  };

  const updateWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id: workoutId } = req.params;
    const { body } = req;

    try {
      const workout = await update(Number(workoutId), body);
      res.status(HttpStatus.OK).send(workout);
    } catch (error) {
      if (error instanceof InvalidWorkoutDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
      if (error instanceof WorkoutNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
    }
  };

  const deleteWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id: workoutId } = req.params;

    try {
      await remove(Number(workoutId));
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof WorkoutNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
    }
  };

  return { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout };
};
