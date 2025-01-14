import { Order } from "./common";

export type Iteration = {
  id: string;
  workoutId: string;
};

// export type IterationDTO = {
//   id: string;
// };

// export type CreateExerciseDTO = Omit<ExerciseDTO, "id" | "difficulty" | "muscles" | "userId"> & {
//   difficultyId: number;
//   muscleIds: number[];
// };
//
// export type UpdateExerciseDTO = Partial<CreateExerciseDTO>;

export type QueryIterationsDTO = Partial<{
  filter: FilterIterationsDTO;
  order: OrderIterationsDTO;
}>;

export type FilterIterationsDTO = Partial<{
  workoutId: number;
}>;

export type OrderIterationsDTO = Partial<{
  createdAt: Order;
}>;
