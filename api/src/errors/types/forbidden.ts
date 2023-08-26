import { ErrorParams } from '.';

export class ForbiddenError extends Error {
  public type = ForbiddenError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Not enough privileges';
    this.meta = meta;
  }
}
