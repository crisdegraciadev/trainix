import { Request, Response } from 'express';
import { HttpStatus } from '../../consts';
import { Effect, Exit, pipe } from 'effect';
import { mapIdToNumber } from '../../utils';
import { handleFailureCauses } from '../../errors/handlers';
import { ExerciseRequestParams, ResponseExerciseDto, UpdateExerciseDto } from './types';
import { retrieveExercise } from './services/retrieve';
import { filterExercises } from './services/filter';
import { createResponseExerciseDto, isValidCreateExerciseDto, isValidUpdateExerciseDto } from './utils';
import { insertExercise } from './services/insert';
import { updateExercise } from './services/update';
import { deleteExercise } from './services/delete';

export const handleFindExerciseById = async (
  req: Request<ExerciseRequestParams>,
  res: Response<ResponseExerciseDto>
): Promise<void> => {
  const { id: exerciseId } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(exerciseId)]),
    Effect.flatMap(([id]) => retrieveExercise({ id })),
    Effect.flatMap((exercise) => createResponseExerciseDto(exercise)),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleFindExerciseByFields = async (
  _req: Request,
  res: Response<ResponseExerciseDto[]>
): Promise<void> => {
  const findByFieldsResult = await pipe(
    Effect.all([filterExercises({})]),
    Effect.map(([exercises]) => exercises.map((user) => Effect.runSync(createResponseExerciseDto(user)))),
    Effect.runPromiseExit
  );

  Exit.match(findByFieldsResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: () => res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR),
  });
};

export const handleCreateExercise = async (req: Request, res: Response<ResponseExerciseDto>): Promise<void> => {
  const { body } = req;

  const createResult = await pipe(
    Effect.all([isValidCreateExerciseDto(body)]),
    Effect.flatMap(([data]) => insertExercise({ data })),
    Effect.flatMap((exercise) => createResponseExerciseDto(exercise)),
    Effect.runPromiseExit
  );

  Exit.match(createResult, {
    onSuccess: (dto) => res.status(HttpStatus.CREATED).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleUpdateExercise = async (
  req: Request<ExerciseRequestParams, unknown, UpdateExerciseDto>,
  res: Response<ResponseExerciseDto>
): Promise<void> => {
  const { body } = req;
  const { id: exerciseId } = req.params;

  const updateResult = await pipe(
    Effect.all([mapIdToNumber(exerciseId), isValidUpdateExerciseDto(body)]),
    Effect.flatMap(([id, data]) => updateExercise({ id, data })),
    Effect.flatMap((exercise) => createResponseExerciseDto(exercise)),
    Effect.runPromiseExit
  );

  Exit.match(updateResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const handleDeleteExercise = async (req: Request<ExerciseRequestParams>, res: Response): Promise<void> => {
  const { id: exerciseId } = req.params;

  const removeResult = await pipe(
    Effect.all([mapIdToNumber(exerciseId)]),
    Effect.flatMap(([id]) => deleteExercise({ id })),
    Effect.flatMap((exercise) => createResponseExerciseDto(exercise)),
    Effect.runPromiseExit
  );

  Exit.match(removeResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};
