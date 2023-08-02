import { UserDto } from '../types';

export const isValidUserDto = (body: unknown): body is UserDto => {
  const { username } = body as UserDto;
  return !!username;
};

export const isValidUpdateUserDto = (body: unknown): body is Partial<UserDto> => {
  const { username } = body as UserDto;
  return !!username;
};
