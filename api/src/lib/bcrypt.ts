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
    catch: () => new InvalidDtoError({ message: 'The provided password is invalid' }),
  });
};

type IsSameHashArgs = HashPasswordArgs & {
  passwordHash: string;
};

export const hasSameHash = ({ password, passwordHash }: IsSameHashArgs): Effect.Effect<never, never, boolean> => {
  return Effect.succeed(bcrypt.compareSync(password, passwordHash));
};
