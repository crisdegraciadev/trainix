import { ErrorParams } from '.';

export class NotFoundError extends Error {
  public type = NotFoundError.name;
  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Entity not found';
    this.meta = meta;
  }
}
