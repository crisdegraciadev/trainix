// Auth
export type LoginDTO = {
  email: string;
  password: string;
};

export type ValidateTokenDTO = {
  token: string;
};

// User
export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type RegisterUserDTO = Omit<UserDTO, "id"> & {
  password: string;
  confirmPassword: string;
};

// Difficulty
export type Difficulty = {
  id: number;
  label: DifficultyLabels;
  value: number;
};

export enum DifficultyLabels {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// Muscle
export type Muscle = {
  id: number;
  label: MuscleLabels;
  value: number;
};

export enum MuscleLabels {
  CHEST = "chest",
  TRICEPS = "triceps",
  BICEPS = "biceps",
  DELTOIDS = "deltoids",
  TRAPEZIUS = "trapezius",
  RHOMBOIDS = "rhomboids",
  CORE = "core",
  GLUTEUS = "gluteus",
  HAMSTRINGS = "hamstrings",
  QUADRICEPS = "quadriceps",
  ADDUCTORS = "adductors",
  ABDUCTORS = "abductors",
  TIBIALIS_ANTERIOR = "tibialis_anterior",
  FOREARM = "forearm",
}

// Exercise
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

export type UpdateExerciseDTO = Partial<ExerciseDTO>;

export type FilterExercisesDTO = Partial<{
  name: string;
  userId: string;
  muscleIds: number[];
  difficultyId: number;
}>;

export type OrderExercisesDTO = Partial<{
  name: Order;
  favourite: Order;
  createdAt: Order;
}>;

export type QueryExercisesDTO = Partial<{
  order: OrderExercisesDTO;
  filter: FilterExercisesDTO;
}>;

// Common
export type PageParams = {
  take: number;
  skip: number;
};

export type Page<T> = {
  values: T[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  pageOffset: number;
};

export type Order = "asc" | "desc";
