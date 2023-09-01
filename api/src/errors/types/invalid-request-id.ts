import { BaseError, ErrorParams } from '.';

export class InvalidRequestIdError extends BaseError {
  public type = InvalidRequestIdError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'The provided id is invalid. The id must be a number';
    this.meta = meta;
  }
}
