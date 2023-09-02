import { WorkoutData } from "./workout";

const { Difficulty, Categories, MuscleGroups } = WorkoutData;

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
        { value: Categories.UPPER, label: "Upper" },
        { value: Categories.LOWER, label: "Lower" },
        { value: Categories.ABS, label: "Abs" },
        { value: Categories.CARDIO, label: "Cardio" },
        { value: Categories.FULL_BODY, label: "Full body" },
      ],
    },
    MuscleGroups: {
      OPTIONS: [
        { value: MuscleGroups.BACK, label: "Back" },
        { value: MuscleGroups.BICEPS, label: "Biceps" },
        { value: MuscleGroups.CALVES, label: "Calves" },
        { value: MuscleGroups.CHEST, label: "Chest" },
        { value: MuscleGroups.CORE, label: "Core" },
        { value: MuscleGroups.GLUTEUS, label: "Gluteus" },
        { value: MuscleGroups.HAMSTRINGS, label: "Hamstrings" },
        { value: MuscleGroups.QUADS, label: "Quads" },
        { value: MuscleGroups.SHOULDERS, label: "Shoulders" },
        { value: MuscleGroups.TRICEPS, label: "Triceps" },
      ],
    },
  },
} as const;
