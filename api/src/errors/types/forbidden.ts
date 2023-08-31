import { BaseError, ErrorParams } from '.';

export class ForbiddenError extends BaseError {
  public type = ForbiddenError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Not enough privileges';
    this.meta = meta;
  }
}
