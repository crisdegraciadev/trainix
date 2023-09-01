import { BaseError, ErrorParams } from '.';

export class RelationError extends BaseError {
  public type = RelationError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Entity is related with other entities';
    this.meta = meta;
  }
}
