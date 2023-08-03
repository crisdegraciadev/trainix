import { Request, Response } from 'express';
import { userCrudService } from './services';
import { HttpStatus } from '../../constants';
import { Effect, Exit, pipe } from 'effect';
import { User } from '@prisma/client';
import { isValidUpdateUserDto } from './utils';
import { mapIdToNumber } from '../../utils';
import { UpdateUserDto, UserRequestParams } from './types';
import { handleFailureCauses } from '../../errors/failure';

export const userController = () => {
  const { findById, findByFields, create, update, remove } = userCrudService();

  const findUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;

    const findByIdEffect = pipe(
      Effect.succeed(id),
      Effect.flatMap((id) => mapIdToNumber(id)),
      Effect.flatMap((id) => findById(id))
    );

    const findByIdResult = await Effect.runPromiseExit(findByIdEffect);

    Exit.match(findByIdResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const findAllUsers = async (_req: Request, res: Response) => {
    const findByFieldsResult = await Effect.runPromiseExit(findByFields());

    Exit.match(findByFieldsResult, {
      onSuccess: (users: User[]) => res.status(HttpStatus.OK).send(users),
      onFailure: ({ _tag, ...error }) => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...error }),
    });
  };

  const createUser = async (req: Request, res: Response) => {
    const { body } = req;

    const createEffect = pipe(
      Effect.succeed(body),
      Effect.flatMap((body) => isValidUpdateUserDto(body)),
      Effect.flatMap(() => create(body))
    );

    const createResult = await Effect.runPromiseExit(createEffect);

    Exit.match(createResult, {
      onSuccess: (user: User) => res.status(HttpStatus.CREATED).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const updateUser = async (req: Request<UserRequestParams, unknown, UpdateUserDto>, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    const updateEffect = pipe(
      Effect.succeed(body),
      Effect.flatMap((body) => isValidUpdateUserDto(body)),
      Effect.flatMap(() => mapIdToNumber(id)),
      Effect.flatMap((userId) => update(userId, body))
    );

    const updateResult = await Effect.runPromiseExit(updateEffect);

    Exit.match(updateResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;

    const removeEffect = pipe(
      Effect.succeed(id),
      Effect.flatMap((id) => mapIdToNumber(id)),
      Effect.flatMap((id) => remove(id))
    );

    const removeResult = await Effect.runPromiseExit(removeEffect);

    Exit.match(removeResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  return { findUser, findAllUsers, createUser, updateUser, deleteUser };
};
