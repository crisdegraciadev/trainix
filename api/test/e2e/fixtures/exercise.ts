import { Difficulty, Muscle } from '@prisma/client';
import { CreateExerciseDto } from '../../../src/resources/exercises/types';

export const EXERCISE_PUSH_UP: CreateExerciseDto = {
  name: 'Push Up',
  description: 'Horizontal push exercise',
  difficulty: Difficulty.EASY,
  muscles: [Muscle.CHEST, Muscle.TRICEPS],
};

export const EXERCISE_PULL_UP: CreateExerciseDto = {
  name: 'Pull Up',
  description: 'Vertical pull exercise',
  difficulty: Difficulty.MEDIUM,
  muscles: [Muscle.BACK, Muscle.BICEPS],
};

export const EXERCISE_SQUAT: CreateExerciseDto = {
  name: 'Squat',
  description: 'Leg pushing exercise',
  difficulty: Difficulty.EASY,
  muscles: [Muscle.QUADS, Muscle.GLUTEUS],
};
