export class InvalidUserDtoError extends Error {
  public type = InvalidUserDtoError.name;

  constructor(message?: string) {
    super();
    this.message = message ?? 'Invalid user DTO';
  }
}
