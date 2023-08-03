import { Request, Response } from 'express';
import { userCrudService } from './services';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from './errors';
import { HttpStatus } from '../../constants';
import { Cause, Effect, Exit, Option, pipe } from 'effect';
import { User } from '@prisma/client';
import { isValidUpdateUserDto, isValidCreateUserDto } from './utils';

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

    const createUserEffect = Effect.if(isValidCreateUserDto(body), {
      onTrue: create(body),
      onFalse: Effect.fail(new InvalidUserDtoError()),
    });

    const createUserResult = await Effect.runPromiseExit(createUserEffect);

    Exit.match(createUserResult, {
      onSuccess: (user: User) => res.status(HttpStatus.CREATED).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
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
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
    const { id } = req.params;
    const userId = pipe(id, Number);

    const removeResult = await Effect.runPromiseExit(remove(userId));

    Exit.match(removeResult, {
      onSuccess: (user: User) => res.status(HttpStatus.OK).send(user),
      onFailure: (cause) => handleFailureCauses(cause, res),
    });
  };

  const handleFailureCauses = (cause: Cause.Cause<InvalidUserDtoError | DuplicateUserError>, res: Response) => {
    const failureOption = Cause.failureOption(cause);

    Option.match(failureOption, {
      onSome: (error) => {
        if (error instanceof InvalidUserDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
        if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
        if (error instanceof DuplicateUserError) res.status(HttpStatus.CONFLICT).send({ error });
      },
      onNone: () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({}),
    });
  };

  return { findUser, findAllUsers, createUser, updateUser, deleteUser };
};
