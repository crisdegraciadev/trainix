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
