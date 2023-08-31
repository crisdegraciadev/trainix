import { BaseError, ErrorParams } from '.';

export class NotFoundError extends BaseError {
  public type = NotFoundError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Entity not found';
    this.meta = meta;
  }
}
