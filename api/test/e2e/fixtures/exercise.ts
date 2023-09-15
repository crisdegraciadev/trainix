import { Difficulty, Muscle } from '@prisma/client';
import { CreateExerciseDto } from '../../../src/resources/exercises/types';

export const EXERCISE_PUSH_UP: CreateExerciseDto = {
  name: 'Push Up',
  description: 'Horizontal push exercise',
  difficulty: Difficulty.easy,
  muscles: [Muscle.chest, Muscle.triceps],
};

export const EXERCISE_PULL_UP: CreateExerciseDto = {
  name: 'Pull Up',
  description: 'Vertical pull exercise',
  difficulty: Difficulty.medium,
  muscles: [Muscle.back, Muscle.biceps],
};

export const EXERCISE_SQUAT: CreateExerciseDto = {
  name: 'Squat',
  description: 'Leg pushing exercise',
  difficulty: Difficulty.easy,
  muscles: [Muscle.quads, Muscle.gluteus],
};
