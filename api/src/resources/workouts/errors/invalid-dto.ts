export class InvalidWorkoutDtoError extends Error {
  public type = InvalidWorkoutDtoError.name;

  constructor(message?: string) {
    super();
    this.message = message ?? 'Invalid workout DTO';
  }
}
