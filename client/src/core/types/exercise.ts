import { Order } from "./common";
import { Difficulty } from "./difficulty";
import { Muscle } from "./muscle";

export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscles: Muscle[];
  difficulty: Difficulty;
  favourite: boolean;
  videoUrl?: string;
};

export type ExerciseDTO = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  difficulty: Difficulty;
  muscles: Muscle[];
  videoUrl?: string;
};

export type CreateExerciseDTO = Omit<ExerciseDTO, "id" | "difficulty" | "muscles" | "userId"> & {
  difficultyId: number;
  muscleIds: number[];
};

export type UpdateExerciseDTO = Partial<CreateExerciseDTO>;

export type QueryExercisesDTO = Partial<{
  filter: FilterExercisesDTO;
  order: OrderExercisesDTO;
}>;

export type FilterExercisesDTO = Partial<{
  name: string;
  muscleIds: number[];
  difficultyId: number;
}>;

export type OrderExercisesDTO = Partial<{
  name: Order;
  createdAt: Order;
}>;
