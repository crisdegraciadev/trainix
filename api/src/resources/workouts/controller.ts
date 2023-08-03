import { Request, Response } from 'express';
import { workoutCrudService } from './services';
import { HttpStatus } from '../../constants';
import { DuplicateWorkoutError, InvalidWorkoutDtoError, WorkoutNotFoundError } from './errors';
import { isValidWorkoutDto } from './utils';
import { Cause, Effect, Exit, Option, pipe } from 'effect';
import { Workout } from '@prisma/client';

export type WorkoutRequestParams = {
  id: number;
};

export const workoutController = () => {
  const { findById, findByFields, create, update, remove } = workoutCrudService();

  const findWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id } = req.params;
    const workoutId = pipe(id, Number);

    const findByIdResult = await Effect.runPromiseExit(findById(workoutId));

    Exit.match(findByIdResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
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

  const handleFailureCauses = <T>(cause: Cause.Cause<T>, res: Response) => {
    const failureOption = Cause.failureOption(cause);

    Option.match(failureOption, {
      onSome: (error) => {
        if (error instanceof WorkoutNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
      },
      onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
    });
  };

  return { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout };
};
