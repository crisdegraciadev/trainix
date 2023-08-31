export class BaseError extends Error {
  type = 'Error';
}

export type ErrorParams = Partial<{
  meta: Record<string, unknown>;
  message: string;
}>;

export * from './duplicate';
export * from './invalid-dto';
export * from './invalid-request-id';
export * from './not-found';
export * from './relation';
export * from './unknown-error';
export * from './unauthorized';
export * from './forbidden';
