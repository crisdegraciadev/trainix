import { Request, Response } from 'express';
import { HttpStatus } from '../../consts';
import { Effect, Exit, pipe } from 'effect';
import { createResponseUserDto, isValidCreateUserDto, isValidUpdateUserDto } from './utils';
import { mapIdToNumber } from '../../utils';
import { ResponseUserDto, UpdateUserDto, FindUserByIdRequestParams } from './types';
import { handleFailureCauses } from '../../errors/handlers';
import { insertUser, retrieveUser, filterUsers, deleteUser, updateUser } from './services';

export const handleFindUserById = async (
  req: Request<FindUserByIdRequestParams>,
  res: Response<ResponseUserDto>
): Promise<void> => {
  const { id: userId } = req.params;

  const findByIdResult = await pipe(
    Effect.all([mapIdToNumber(userId)]),
    Effect.flatMap(([id]) => retrieveUser({ id })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(findByIdResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => {
      const [errorResponse, error] = handleFailureCauses(cause, res);
      errorResponse.send({ error });
    },
  });
};

export const handleFindUserByFields = async (req: Request, res: Response<ResponseUserDto[]>): Promise<void> => {
  const { query } = req;

  const findByFieldsResult = await pipe(
    Effect.all([filterUsers({ facetedFilters: { ...query } })]),
    Effect.map(([users]) => users.map((user) => Effect.runSync(createResponseUserDto(user)))),
    Effect.runPromiseExit
  );

  Exit.match(findByFieldsResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: () => res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR),
  });
};

export const handleCreateUser = async (req: Request, res: Response<ResponseUserDto>): Promise<void> => {
  const { body } = req;

  const createResult = await pipe(
    Effect.all([isValidCreateUserDto(body)]),
    Effect.flatMap(([data]) => insertUser({ dto: data })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(createResult, {
    onSuccess: (dto) => res.status(HttpStatus.CREATED).send(dto),
    onFailure: (cause) => {
      const [errorResponse, error] = handleFailureCauses(cause, res);
      errorResponse.send({ error });
    },
  });
};

export const handleUpdateUser = async (
  req: Request<FindUserByIdRequestParams, unknown, UpdateUserDto>,
  res: Response<ResponseUserDto>
): Promise<void> => {
  const { body } = req;
  const { id: userId } = req.params;

  const updateResult = await pipe(
    Effect.all([mapIdToNumber(userId), isValidUpdateUserDto(body)]),
    Effect.flatMap(([id, data]) => updateUser({ id, data })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(updateResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => {
      const [errorResponse, error] = handleFailureCauses(cause, res);
      errorResponse.send({ error });
    },
  });
};

export const handleDeleteUser = async (req: Request<FindUserByIdRequestParams>, res: Response): Promise<void> => {
  const { id: userId } = req.params;

  const removeResult = await pipe(
    Effect.all([mapIdToNumber(userId)]),
    Effect.flatMap(([id]) => deleteUser({ id })),
    Effect.flatMap((user) => createResponseUserDto(user)),
    Effect.runPromiseExit
  );

  Exit.match(removeResult, {
    onSuccess: (dto) => res.status(HttpStatus.OK).send(dto),
    onFailure: (cause) => {
      const [errorResponse, error] = handleFailureCauses(cause, res);
      errorResponse.send({ error });
    },
  });
};
