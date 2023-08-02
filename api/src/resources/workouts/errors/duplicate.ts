export class DuplicateWorkoutError extends Error {
  public type = 'DuplicateWorkoutError';

  constructor(message?: string) {
    super();
    this.message = message ?? 'Some fields does not respect unique constraints';
  }
}
