import { BaseError, ErrorParams } from '.';

export class InvalidDtoError extends BaseError {
  public type = InvalidDtoError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Invalid dto';
    this.meta = meta;
  }
}
