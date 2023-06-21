export class UserNotFoundError extends Error {
  public type = 'UserNotFoundError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'User not found';
  }
}
