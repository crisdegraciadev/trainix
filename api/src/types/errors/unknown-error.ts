import { ErrorParams } from '../error-params';

export class UnknownError extends Error {
  public type = UnknownError.name;
  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'UnknownError';
    this.meta = meta;
  }
}
