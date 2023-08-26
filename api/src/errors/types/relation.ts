import { ErrorParams } from '.';

export class RelationError extends Error {
  public type = RelationError.name;

  public meta?: Record<string, unknown>;

  constructor({ message, meta }: ErrorParams) {
    super();
    this.message = message ?? 'Entity is related with other entities';
    this.meta = meta;
  }
}
