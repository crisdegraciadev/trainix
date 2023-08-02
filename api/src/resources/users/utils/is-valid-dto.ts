import { CreateUserDto, UpdateUserDto } from '../types';

export const isValidCreateUserDto = (body: unknown): body is CreateUserDto => {
  const { username } = body as CreateUserDto;
  return !!username;
};

export const isValidUpdateUserDto = (body: unknown): body is UpdateUserDto => {
  const { username } = body as CreateUserDto;
  return !!username;
};
