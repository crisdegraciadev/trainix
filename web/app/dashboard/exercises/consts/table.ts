import { Difficulty, Muscle } from "../../../../types/enums";

export const ExerciseTable = {
  Cells: {
    Name: {
      ACCESSOR_KEY: "name",
      TITLE: "Name",
    },
    Description: {
      ACCESSOR_KEY: "description",
      TITLE: "Description",
    },
    Difficulty: {
      ACCESSOR_KEY: "difficulty",
      TITLE: "Difficulty",
    },
    MuscleGroups: {
      ACCESSOR_KEY: "muscles",
      TITLE: "Muscles",
    },
  },
  FacetedFilters: {
    Difficulty: {
      OPTIONS: [
        { value: Difficulty.EASY, label: "Easy" },
        { value: Difficulty.MEDIUM, label: "Medium" },
        { value: Difficulty.HARD, label: "Hard" },
      ],
    },
    MuscleGroups: {
      OPTIONS: [
        { value: Muscle.BACK, label: "Back" },
        { value: Muscle.BICEPS, label: "Biceps" },
        { value: Muscle.CALVES, label: "Calves" },
        { value: Muscle.CHEST, label: "Chest" },
        { value: Muscle.CORE, label: "Core" },
        { value: Muscle.GLUTEUS, label: "Gluteus" },
        { value: Muscle.HAMSTRINGS, label: "Hamstrings" },
        { value: Muscle.QUADS, label: "Quads" },
        { value: Muscle.SHOULDERS, label: "Shoulders" },
        { value: Muscle.TRICEPS, label: "Triceps" },
      ],
    },
  },
} as const;
