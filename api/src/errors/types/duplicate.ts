import { BaseError, ErrorParams } from '.';

export class DuplicateError extends BaseError {
  public type = DuplicateError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Some fields does not respect unique constraints';
    this.meta = meta;
  }
}
