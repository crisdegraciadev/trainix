import { Request, Response } from 'express';
import { ActivityRequestParams, UpdateActivityDto } from './types';
import { activityCrudService } from './services';
import { Effect, Exit, pipe } from 'effect';
import { mapIdToNumber } from '../../utils';
import { Activity } from '@prisma/client';
import { HttpStatus } from '../../consts';
import { handleFailureCauses } from '../../errors/handlers';
import { isValidCreateActivityDto, isValidUpdateActivityDto } from './utils';

export const activityController = () => {
  const { findById, findByFields, create, update, remove } = activityCrudService();

  const findActivity = async (req: Request<ActivityRequestParams>, res: Response) => {
    const { id } = req.params;

    const findByIdResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => findById({ id })),
      Effect.runPromiseExit,
    );

    Exit.match(findByIdResult, {
      onSuccess: (activity: Activity) => res.status(HttpStatus.OK).send(activity),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const findAllActivities = async (_req: Request, res: Response) => {
    const findByFieldsResult = await Effect.runPromiseExit(findByFields({}));

    Exit.match(findByFieldsResult, {
      onSuccess: (activities: Activity[]) => res.status(HttpStatus.OK).send(activities),
      onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
    });
  };

  const createActivity = async (req: Request, res: Response) => {
    const { body } = req;

    const createResult = await pipe(
      Effect.all([isValidCreateActivityDto(body)]),
      Effect.flatMap(([data]) => create({ data })),
      Effect.runPromiseExit,
    );

    Exit.match(createResult, {
      onSuccess: (activity: Activity) => res.status(HttpStatus.CREATED).send(activity),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const updateActivity = async (req: Request<ActivityRequestParams, unknown, UpdateActivityDto>, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    const updateResult = await pipe(
      Effect.all([mapIdToNumber(id), isValidUpdateActivityDto(body)]),
      Effect.flatMap(([id, data]) => update({ id, data })),
      Effect.runPromiseExit,
    );

    Exit.match(updateResult, {
      onSuccess: (acitivity: Activity) => res.status(HttpStatus.OK).send(acitivity),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteActivity = async (req: Request<ActivityRequestParams>, res: Response) => {
    const { id } = req.params;

    const removeResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => remove({ id })),
      Effect.runPromiseExit,
    );

    Exit.match(removeResult, {
      onSuccess: (activity: Activity) => res.status(HttpStatus.OK).send(activity),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  return { findActivity, findAllActivities, createActivity, updateActivity, deleteActivity };
};
