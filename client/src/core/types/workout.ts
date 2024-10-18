import { Order } from "./common";
import { Difficulty } from "./difficulty";
import { Muscle } from "./muscle";

export type Workout = {
  id: string;
  name: string;
  description: string;
  muscles: Muscle[];
  difficulty: Difficulty;
  favourite: boolean;
  videoUrl?: string;
};

export type WorkoutDTO = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};

export type CreateWorkoutDTO = Omit<WorkoutDTO, "id" | "difficulty" | "muscles" | "userId"> & {
  difficultyId: number;
  muscleIds: number[];
};

export type UpdateWorkoutDTO = Partial<CreateWorkoutDTO>;

export type QueryWorkoutsDTO = Partial<{
  filter: FilterWorkoutsDTO;
  order: OrderWorkoutsDTO;
}>;

export type FilterWorkoutsDTO = Partial<{
  name: string;
  muscleIds: number[];
  difficultyId: number;
}>;

export type OrderWorkoutsDTO = Partial<{
  name: Order;
  createdAt: Order;
}>;
