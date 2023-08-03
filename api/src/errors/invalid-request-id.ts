export class InvalidRequestIdError extends Error {
  public type = InvalidRequestIdError.name;

  constructor(message?: string) {
    super();
    this.message = message ?? 'Some fields does not respect unique constraints';
  }
}
