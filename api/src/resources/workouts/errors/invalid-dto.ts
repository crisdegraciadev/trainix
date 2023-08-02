export class InvalidWorkoutDtoError extends Error {
  public type = 'WorkoutDtoError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Invalid workout DTO';
  }
}
