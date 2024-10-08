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

export type RegisterUserDTO = Omit<UserDTO, 'id'> & {
  password: string;
  confirmPassword: string;
};

// Difficulty
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Muscle
export enum Muscle {
  CHEST = 'CHEST',
  TRICEPS = 'TRICEPS',
  BICEPS = 'BICEPS',
  DELTOIDS = 'DELTOIDS',
  TRAPEZIUS = 'TRAPEZIUS',
  RHOMBOIDS = 'RHOMBOIDS',
  CORE = 'CORE',
  GLUTEUS = 'GLUTEUS',
  HAMSTRINGS = 'HAMSTRINGS',
  QUADRICEPS = 'QUADRICEPS',
  ADDUCTORS = 'ADDUCTORS',
  ABDUCTORS = 'ABDUCTORS',
  TIBIALIS_ANTERIOR = 'TIBIALIS_ANTERIOR',
  FOREARM = 'FOREARM',
}

// Exercise
export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscles: Muscle[];
  difficulty: Difficulty;
  favourite: boolean;
  video?: string;
};

export type ExerciseDTO = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  difficulty: Difficulty;
  muscles: Muscle[];
  favourite: boolean;
  video?: string;
};

export type CreateExerciseDTO = ExerciseDTO;

export type UpdateExerciseDTO = Partial<ExerciseDTO>;

export type FilterExercisesDTO = Partial<{
  name: string;
  userId: string;
  favourite: string;
  muscles: Muscle[];
  difficulty: Difficulty;
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
  offset: number;
  limit: number;
};

export type Page<T> = {
  values: T[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  pageOffset: number;
};

export type Order = 'asc' | 'desc';
