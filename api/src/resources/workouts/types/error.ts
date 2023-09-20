import { DuplicateError, NotFoundError } from '../../../errors/types';

export type FindWorkoutByIdErrors = NotFoundError;
export type FindWorkoutsByFieldsErrors = never;
export type CreateWorkoutErrors = DuplicateError;
export type UpdateWorkoutErrors = NotFoundError;
export type RemoveWorkoutErrors = NotFoundError;
