import { WorkoutDto } from '../types';

export const isValidWorkoutDto = (body: unknown): body is WorkoutDto => {
  const { name, userId } = body as WorkoutDto;
  return !!name && !!userId;
};
