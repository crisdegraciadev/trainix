export class InvalidUserDtoError extends Error {
  public type = 'UserDtoError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Invalid user DTO';
  }
}

export class DuplicateUserError extends Error {
  public type = 'DuplicateUserError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Some fields does not respect unique constraints';
  }
}

export class UserNotFoundError extends Error {
  public type = 'UserNotFoundError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'User not found';
  }
}
