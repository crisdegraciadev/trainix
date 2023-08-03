import { Request, Response } from 'express';
import { workoutCrudService } from './services';
import { HttpStatus } from '../../constants';
import { isValidCreateWorkoutDto, isValidUpdateWorkoutDto } from './utils';
import { Effect, Exit, pipe } from 'effect';
import { Workout } from '@prisma/client';
import { handleFailureCauses } from '../../errors/failure';
import { mapIdToNumber } from '../../utils';
import { NotFoundError } from '../../types';

export type WorkoutRequestParams = {
  id: string;
};

export const workoutController = () => {
  const { findById, findByFields, create, update, remove } = workoutCrudService();

  const findWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id } = req.params;

    const findByIdEffect = pipe(
      Effect.succeed(id),
      Effect.flatMap((id) => mapIdToNumber(id)),
      Effect.flatMap((id) => findById(id))
    );

    const findByIdResult = await Effect.runPromiseExit(findByIdEffect);

    Exit.match(findByIdResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const findAllWorkouts = async (_req: Request, res: Response) => {
    const findByFieldsResult = await Effect.runPromiseExit(findByFields());

    Exit.match(findByFieldsResult, {
      onSuccess: (users: Workout[]) => res.status(HttpStatus.OK).send(users),
      onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
    });
  };

  const createWorkout = async (req: Request, res: Response) => {
    const { body } = req;

    const createEffect = pipe(
      Effect.succeed(body),
      Effect.flatMap((body) => isValidCreateWorkoutDto(body)),
      Effect.flatMap(() => create(body))
    );

    const createResult = await Effect.runPromiseExit(createEffect);

    Exit.match(createResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.CREATED).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const updateWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    const updateEffect = pipe(
      Effect.succeed(body),
      Effect.flatMap((body) => isValidUpdateWorkoutDto(body)),
      Effect.flatMap(() => mapIdToNumber(id)),
      Effect.flatMap((workoutId) => update(workoutId, body))
    );

    const updateResult = await Effect.runPromiseExit(updateEffect);

    Exit.match(updateResult, {
      onSuccess: (workout: Workout) => res.status(HttpStatus.OK).send(workout),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteWorkout = async (req: Request<WorkoutRequestParams>, res: Response) => {
    const { id: workoutId } = req.params;

    try {
      await remove(Number(workoutId));
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof NotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
    }
  };

  return { findWorkout, findAllWorkouts, createWorkout, updateWorkout, deleteWorkout };
};
