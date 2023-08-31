import { BaseError, ErrorParams } from '.';

export class UnknownError extends BaseError {
  public type = UnknownError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'UnknownError';
    this.meta = meta;
  }
}
