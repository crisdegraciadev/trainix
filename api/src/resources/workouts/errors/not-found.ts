export class WorkoutNotFoundError extends Error {
  public type = WorkoutNotFoundError.name;

  constructor(message?: string) {
    super();
    this.message = message ?? 'Workout not found';
  }
}
