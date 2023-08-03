export class DuplicateUserError extends Error {
  public type = DuplicateUserError.name;

  constructor(message?: string) {
    super();
    this.message = message ?? 'Some fields does not respect unique constraints';
  }
}
