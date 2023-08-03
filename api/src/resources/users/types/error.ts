import { DuplicateError, NotFoundError } from '../../../types';

export type FindUserByIdErrors = NotFoundError;
export type FindUsersByFieldsErrors = never;
export type CreateUserErrors = DuplicateError;
export type UpdateUserErrors = NotFoundError;
export type RemoveUserErrors = NotFoundError;
