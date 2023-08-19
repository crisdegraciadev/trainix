import bcrypt from 'bcrypt';
import { Global } from '../consts/global';
import { Effect } from 'effect';
import { InvalidDtoError } from '../errors/types';

type HashPasswordArgs = {
  password: string;
};

const SALT = bcrypt.genSaltSync(Global.SALT_ROUNDS);

export const hashPassword = ({ password }: HashPasswordArgs): Effect.Effect<never, InvalidDtoError, string> => {
  return Effect.try({
    try: () => bcrypt.hashSync(password, SALT),
    catch: (error) => {
      console.log(error);
      return new InvalidDtoError({ message: 'The provided password is invalid' });
    },
  });
};
