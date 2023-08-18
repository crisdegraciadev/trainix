import { Request, Response } from 'express';
import { workoutCrudService } from './services';
import { HttpStatus } from '../../consts';
import { isValidCreateWorkoutDto, isValidUpdateWorkoutDto } from './utils';
import { Effect, Exit, pipe } from 'effect';
import { Workout } from '@prisma/client';
import { mapIdToNumber } from '../../utils';
import { WorkoutRequestParams } from './types';
import { handleFailureCauses } from '../../errors/handlers';

export const workoutController = () => {
  const { findById, findByFields, create, update, remove } = workoutCrudService();

  const findWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id } = req.params;

    const findByIdResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => findById({ id })),
      Effect.runPromiseExit
    );

    Exit.match(findByIdResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const findAllWorkouts = async (_req: Request, res: Response) => {
    const findByFieldsResult = await Effect.runPromiseExit(findByFields({}));

    Exit.match(findByFieldsResult, {
      onSuccess: (workouts: Workout[]) => res.status(HttpStatus.OK).send(workouts),
      onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
    });
  };

  const createWorkout = async (req: Request, res: Response) => {
    const { body } = req;

    const createResult = await pipe(
      Effect.all([isValidCreateWorkoutDto(body)]),
      Effect.flatMap(([data]) => create({ data })),
      Effect.runPromiseExit
    );

    Exit.match(createResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.CREATED).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const updateWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    const updateResult = await pipe(
      Effect.all([mapIdToNumber(id), isValidUpdateWorkoutDto(body)]),
      Effect.flatMap(([id, data]) => update({ id, data })),
      Effect.runPromiseExit
    );

    Exit.match(updateResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id } = req.params;

    const removeResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => remove({ id })),
      Effect.runPromiseExit
    );

    Exit.match(removeResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  return { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout };
};
