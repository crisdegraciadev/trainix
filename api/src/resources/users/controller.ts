import { Request, Response } from 'express';
import { HttpStatus } from '../../consts';
import { Effect, Exit, pipe } from 'effect';
import { createResponseUserDto, isValidCreateUserDto, isValidUpdateUserDto } from './utils';
import { mapIdToNumber } from '../../utils';
import { ResponseUserDto, UpdateUserDto, UserRequestParams } from './types';
import { handleFailureCauses } from '../../errors/handlers';
import { create, findUserById, findUsersByFields, remove, update } from './services';

export const getUserById = async (req: Request<UserRequestParams>, res: Response<ResponseUserDto>) => {
  const { id } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(id)]),
    Effect.flatMap(([id]) => findUserById({ id })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const getUsersByFields = async (_req: Request, res: Response<ResponseUserDto[]>) => {
  const findByFieldsResult = await pipe(
    Effect.all([findUsersByFields({})]),
    Effect.map(([users]) => users.map((user) => Effect.runSync(createResponseUserDto(user)))),
    Effect.runPromiseExit
  );

  Exit.match(findByFieldsResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: () => res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR),
  });
};

export const postUser = async (req: Request, res: Response<ResponseUserDto>) => {
  const { body } = req;

  const createResult = await pipe(
    Effect.all([isValidCreateUserDto(body)]),
    Effect.flatMap(([data]) => create({ dto: data })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(createResult, {
    onSuccess: (dto) => res.status(HttpStatus.CREATED).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const putUser = async (
  req: Request<UserRequestParams, unknown, UpdateUserDto>,
  res: Response<ResponseUserDto>
) => {
  const { body } = req;
  const { id } = req.params;

  const updateResult = await pipe(
    Effect.all([mapIdToNumber(id), isValidUpdateUserDto(body)]),
    Effect.flatMap(([id, data]) => update({ id, data })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(updateResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};

export const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
  const { id } = req.params;

  const removeResult = await pipe(
    Effect.all([mapIdToNumber(id)]),
    Effect.flatMap(([id]) => remove({ id })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(removeResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => handleFailureCauses(cause, res),
  });
};
