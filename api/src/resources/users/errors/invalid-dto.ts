export class InvalidUserDtoError extends Error {
  public type = 'UserDtoError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Invalid user DTO';
  }
}
