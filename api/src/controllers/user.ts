import { Request, Response } from 'express';
import { isValidUserDTO } from '../utils';
import { DuplicateUserError, InvalidUserDtoError, UserNotFoundError } from '../errors';
import { findUserById, findUsersByFields, saveUser } from '../crud';

export const findUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  try {
    const user = await findUserById(userId);

    res.status(200).send(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) res.status(404).send({ error });
  }
};

export const findAllUsers = async (_req: Request, res: Response) => {
  const users = await findUsersByFields();
  res.status(200).send(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    if (!isValidUserDTO(body)) {
      throw new InvalidUserDtoError();
    }

    const user = await saveUser(body);

    res.status(201).send(user);
  } catch (error) {
    if (error instanceof InvalidUserDtoError) res.status(400).send({ error });
    if (error instanceof DuplicateUserError) res.status(409).send({ error });
  }
};

export const updateUser = (_req: Request, res: Response) => {
  res.send('Unimplemented');
};

export const deleteUser = (_req: Request, res: Response) => {
  res.send('Unimplemented');
};
