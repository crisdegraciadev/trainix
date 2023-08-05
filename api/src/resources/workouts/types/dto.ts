export type CreateWorkoutDto = {
  name: string;
  userId: number;
};

export type UpdateWorkoutDto = Partial<CreateWorkoutDto>;
