import { UserDto } from '../types';

export const isValidUserDto = (body: unknown): body is UserDto => {
  const { username } = body as UserDto;
  return !!username;
};
