import { Request, Response } from 'express';
import { userCrudService } from './services';
import { InvalidUserDtoError } from './errors';
import { HttpStatus } from '../../constants';
import { Effect, Exit, pipe } from 'effect';
import { User } from '@prisma/client';
import { handleUserErrors, isValidUpdateUserDto, isValidUserDto } from './utils';

export type UserRequestParams = {
  id: number;
};

export const userController = () => {
  const { findById, findByFields, create, update, remove } = userCrudService();

  const findUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;
    const userId = pipe(id, Number);

    const findByIdResult = await Effect.runPromiseExit(findById(userId));

    Exit.match(findByIdResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleUserErrors(cause, res),
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

    const createUserEffect = Effect.if(isValidUserDto(body), {
      onTrue: create(body),
      onFalse: Effect.fail(new InvalidUserDtoError()),
    });

    const createUserResult = await Effect.runPromiseExit(createUserEffect);

    Exit.match(createUserResult, {
      onSuccess: (user: User) => res.status(HttpStatus.CREATED).send(user),
      onFailure: (cause) => handleUserErrors(cause, res),
    });
  };

  const updateUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { body } = req;

    const { id } = req.params;
    const userId = pipe(id, Number);

    const updateUserEffect = Effect.if(isValidUpdateUserDto(body), {
      onTrue: update(userId, body),
      onFalse: Effect.fail(new InvalidUserDtoError()),
    });

    const updateUserResult = await Effect.runPromiseExit(updateUserEffect);

    Exit.match(updateUserResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleUserErrors(cause, res),
    });
  };

  const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;
    const userId = pipe(id, Number);

    const removeResult = await Effect.runPromiseExit(remove(userId));

    Exit.match(removeResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleUserErrors(cause, res),
    });
  };

  return { findUser, findAllUsers, createUser, updateUser, deleteUser };
};
