import { UserDto } from '../types';

export const isValidUserDTO = (body: unknown): body is UserDto => {
  const { username } = body as UserDto;
  return !!username;
};
