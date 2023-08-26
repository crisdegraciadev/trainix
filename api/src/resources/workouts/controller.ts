import { Workout } from '@prisma/client';
import { Effect, Exit, pipe } from 'effect';
import { Request, Response } from 'express';
import { HttpStatus } from '../../consts';
import { handleFailureCauses } from '../../errors/handlers';
import { mapIdToNumber } from '../../utils';
import { createWorkout, deleteWorkout, findWorkoutByFields, findWorkoutById, update } from './services';
import { WorkoutRequestParams } from './types';
import { isValidCreateWorkoutDto, isValidUpdateWorkoutDto } from './utils';

export const handleFindWorkoutById = async (req: Request<WorkoutRequestParams>, res: Response): Promise<void> => {
  const { id: workoutId } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(workoutId)]),
    Effect.flatMap(([id]) => findWorkoutById({ id })),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleFindWorkoutByFields = async (_req: Request, res: Response): Promise<void> => {
  const findByFieldsResult = await Effect.runPromiseExit(findWorkoutByFields({}));

  Exit.match(findByFieldsResult, {
    onSuccess: (workouts: Workout[]) => res.status(HttpStatus.OK).send(workouts),
    onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
  });
};

export const handleCreateWorkout = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;

  const createResult = await pipe(
    Effect.all([isValidCreateWorkoutDto(body)]),
    Effect.flatMap(([data]) => createWorkout({ data })),
    Effect.runPromiseExit
  );

  Exit.match(createResult, {
    onSuccess: (workout: Workout) => res.status(HttpStatus.CREATED).send(workout),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleUpdateWorkout = async (req: Request<WorkoutRequestParams>, res: Response): Promise<void> => {
  const { body } = req;
  const { id: workoutId } = req.params;

  const updateResult = await pipe(
    Effect.all([mapIdToNumber(workoutId), isValidUpdateWorkoutDto(body)]),
    Effect.flatMap(([id, data]) => update({ id, data })),
    Effect.runPromiseExit
  );

  Exit.match(updateResult, {
    onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleDeleteWorkout = async (req: Request<WorkoutRequestParams>, res: Response): Promise<void> => {
  const { id: workoutId } = req.params;

  const removeResult = await pipe(
    Effect.all([mapIdToNumber(workoutId)]),
    Effect.flatMap(([id]) => deleteWorkout({ id })),
    Effect.runPromiseExit
  );

  Exit.match(removeResult, {
    onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};
