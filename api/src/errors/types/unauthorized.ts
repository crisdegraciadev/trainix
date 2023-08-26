import { ErrorParams } from '.';

export class UnauthorizedError extends Error {
  public type = UnauthorizedError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Invalid credentials';
    this.meta = meta;
  }
}
