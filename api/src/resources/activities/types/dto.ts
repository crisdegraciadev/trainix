export type CreateActivityDto = {
  sets: number;
  reps: number;
  exerciseId: number;
};

export type UpdateActivityDto = Partial<CreateActivityDto>;
