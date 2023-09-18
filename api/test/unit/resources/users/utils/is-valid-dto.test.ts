import { Effect } from 'effect';
import { isValidCreateUserDto, isValidUpdateUserDto } from '../../../../../src/resources/users/utils';

describe('isValidCreateUserDto()', () => {
  it('valid dto', () => {
    const validDto = {
      email: 'user@example.com',
      username: 'username',
      password: 'password',
      repeatedPassword: 'password',
    };

    const dto = Effect.runSync(isValidCreateUserDto(validDto));

    expect(dto).toEqual(validDto);
  });

  it('missing email', () => {
    const invalidDto = {
      username: 'username',
      password: 'password',
      repeatedPassword: 'password',
    };

    const effect = isValidCreateUserDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });

  it('missing username', () => {
    const invalidDto = {
      email: 'user@example.com',
      password: 'password',
      repeatedPassword: 'password',
    };

    const effect = isValidCreateUserDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });

  it('missing password', () => {
    const invalidDto = {
      email: 'user@example.com',
      username: 'username',
      repeatedPassword: 'password',
    };

    const effect = isValidCreateUserDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });

  it('missmatching passwords', () => {
    const invalidDto = {
      email: 'user@example.com',
      username: 'username',
      password: 'password',
      repeatedPassword: 'differentpassword',
    };

    const effect = isValidCreateUserDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });
});

describe('isValidUpdateUserDto()', () => {
  it('valid dto', () => {
    const validDto = {
      email: 'user@example.com',
      username: 'new-username',
    };

    const dto = Effect.runSync(isValidUpdateUserDto(validDto));

    expect(dto).toEqual(validDto);
  });

  it('partial dto', () => {
    const validDto = {
      username: 'new-username',
    };

    const dto = Effect.runSync(isValidUpdateUserDto(validDto));

    expect(dto).toEqual(validDto);
  });

  it('invalid dto', () => {
    const invalidDto = {};

    const effect = isValidUpdateUserDto(invalidDto);

    expect(() => Effect.runSync(effect)).toThrow('Invalid dto');
  });
});
