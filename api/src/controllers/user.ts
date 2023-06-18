import { Request, Response } from 'express';
import { HttpStatus } from '../constants';
import { userCrud } from '../crud';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from '../errors';
import { UserRequestParams } from '../types';
import { isValidUserDTO } from '../utils';

const { findById, findByFields, create, update, remove } = userCrud();

export const findUser = async (req: Request<UserRequestParams>, res: Response) => {
  const { id: userId } = req.params;

  try {
    const user = await findById(userId);

    res.status(HttpStatus.OK).send(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
  }
};

export const findAllUsers = async (_req: Request, res: Response) => {
  const users = await findByFields();
  res.status(HttpStatus.OK).send(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    if (!isValidUserDTO(body)) {
      throw new InvalidUserDtoError();
    }

    const user = await create(body);

    res.status(HttpStatus.CREATED).send(user);
  } catch (error) {
    if (error instanceof InvalidUserDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
    if (error instanceof DuplicateUserError) res.status(HttpStatus.CONFLICT).send({ error });
  }
};

export const updateUser = async (req: Request<UserRequestParams>, res: Response) => {
  const { id: userId } = req.params;
  const { body } = req;

  try {
    const user = await update(userId, body);
    res.status(HttpStatus.OK).send(user);
  } catch (error) {
    if (error instanceof InvalidUserDtoError) res.status(HttpStatus.BAD_REQUEST).send({ error });
    if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
  }
};

export const deleteUser = async (req: Request<UserRequestParams>, res: Response) => {
  const { id: userId } = req.params;

  try {
    await remove(userId);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) res.status(HttpStatus.NOT_FOUND).send({ error });
  }
};
