import { Request, Response } from 'express';
import { ActivityRequestParams, UpdateActivityDto } from './types';
import { Effect, Exit, pipe } from 'effect';
import { mapIdToNumber } from '../../utils';
import { Activity } from '@prisma/client';
import { HttpStatus } from '../../consts';
import { handleFailureCauses } from '../../errors/handlers';
import { isValidCreateActivityDto, isValidUpdateActivityDto } from './utils';
import { insertActivity, filterActivities, retrieveActivity, updateActivity, deleteActivity } from './services';

export const handleFindActivityById = async (req: Request<ActivityRequestParams>, res: Response): Promise<void> => {
  const { id: activityId } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(activityId)]),
    Effect.flatMap(([id]) => retrieveActivity({ id })),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (activity: Activity) => res.status(HttpStatus.OK).send(activity),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleFindActivityByFields = async (_req: Request, res: Response): Promise<void> => {
  const findByFieldsResult = await Effect.runPromiseExit(filterActivities({}));

  Exit.match(findByFieldsResult, {
    onSuccess: (activities: Activity[]) => res.status(HttpStatus.OK).send(activities),
    onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
  });
};

export const handleCreateActivity = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;

  const createResult = await pipe(
    Effect.all([isValidCreateActivityDto(body)]),
    Effect.flatMap(([data]) => insertActivity({ data })),
    Effect.runPromiseExit
  );

  Exit.match(createResult, {
    onSuccess: (activity: Activity) => res.status(HttpStatus.CREATED).send(activity),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleUpdateActivity = async (
  req: Request<ActivityRequestParams, unknown, UpdateActivityDto>,
  res: Response
): Promise<void> => {
  const { body } = req;
  const { id: activityId } = req.params;

  const updateResult = await pipe(
    Effect.all([mapIdToNumber(activityId), isValidUpdateActivityDto(body)]),
    Effect.flatMap(([id, data]) => updateActivity({ id, data })),
    Effect.runPromiseExit
  );

  Exit.match(updateResult, {
    onSuccess: (activity: Activity) => res.status(HttpStatus.OK).send(activity),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleDeleteActivity = async (req: Request<ActivityRequestParams>, res: Response): Promise<void> => {
  const { id: activityId } = req.params;

  const removeResult = await pipe(
    Effect.all([mapIdToNumber(activityId)]),
    Effect.flatMap(([id]) => deleteActivity({ id })),
    Effect.runPromiseExit
  );

  Exit.match(removeResult, {
    onSuccess: (activity: Activity) => res.status(HttpStatus.OK).send(activity),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};
