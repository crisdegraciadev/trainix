import { Category, Difficulty, Muscle } from "../../../../types/enums";

export const WorkoutTable = {
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
    Category: {
      ACCESSOR_KEY: "category",
      TITLE: "Category",
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
    Category: {
      OPTIONS: [
        { value: Category.UPPER, label: "Upper" },
        { value: Category.LOWER, label: "Lower" },
        { value: Category.ABS, label: "Abs" },
        { value: Category.CARDIO, label: "Cardio" },
        { value: Category.FULL_BODY, label: "Full body" },
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
