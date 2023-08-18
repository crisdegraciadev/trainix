import { Request, Response } from 'express';
import { HttpStatus } from '../../consts';
import { Effect, Exit, pipe } from 'effect';
import { User } from '@prisma/client';
import { isValidCreateUserDto, isValidUpdateUserDto } from './utils';
import { mapIdToNumber } from '../../utils';
import { UpdateUserDto, UserRequestParams } from './types';
import { handleFailureCauses } from '../../errors/handlers';
import { create, findUserById, findUsersByFields, remove, update } from './services';

export const userController = () => {
  const findUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;

    const findByIdResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => findUserById({ id })),
      Effect.runPromiseExit
    );

    Exit.match(findByIdResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const findAllUsers = async (_req: Request, res: Response) => {
    const findByFieldsResult = await Effect.runPromiseExit(findUsersByFields({}));

    Exit.match(findByFieldsResult, {
      onSuccess: (users: User[]) => res.status(HttpStatus.OK).send(users),
      onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
    });
  };

  const createUser = async (req: Request, res: Response) => {
    const { body } = req;

    const createResult = await pipe(
      Effect.all([isValidCreateUserDto(body)]),
      Effect.flatMap(([data]) => create({ data })),
      Effect.runPromiseExit
    );

    Exit.match(createResult, {
      onSuccess: (user: User) => res.status(HttpStatus.CREATED).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const updateUser = async (req: Request<UserRequestParams, unknown, UpdateUserDto>, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    const updateResult = await pipe(
      Effect.all([mapIdToNumber(id), isValidUpdateUserDto(body)]),
      Effect.flatMap(([id, data]) => update({ id, data })),
      Effect.runPromiseExit
    );

    Exit.match(updateResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;

    const removeResult = await pipe(
      Effect.all([mapIdToNumber(id)]),
      Effect.flatMap(([id]) => remove({ id })),
      Effect.runPromiseExit
    );

    Exit.match(removeResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  return { findUser, findAllUsers, createUser, updateUser, deleteUser };
};
