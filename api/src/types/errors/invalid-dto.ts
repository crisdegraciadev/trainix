import { ErrorParams } from '../error-params';

export class InvalidDtoError extends Error {
  public type = InvalidDtoError.name;
  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Invalid dto';
    this.meta = meta;
  }
}
