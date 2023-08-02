export class WorkoutNotFoundError extends Error {
  public type = 'WorkoutNotFoundError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Workout not found';
  }
}
