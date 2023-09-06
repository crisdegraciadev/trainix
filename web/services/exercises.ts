import { Exercise } from "../types/entities";
import { Difficulty, Muscle } from "../types/enums";

export async function fetchExercises(): Promise<Exercise[]> {
  return [
    {
      id: "1",
      name: "Push-Up",
      description:
        "A classic bodyweight exercise that targets the chest and triceps.",
      difficulty: Difficulty.MEDIUM,
      muscles: [Muscle.CHEST, Muscle.TRICEPS],
    },
    {
      id: "2",
      name: "Squat",
      description:
        "A lower body exercise that works the quads, hamstrings, and glutes.",
      difficulty: Difficulty.MEDIUM,
      muscles: [Muscle.QUADS, Muscle.HAMSTRINGS, Muscle.GLUTEUS],
    },
    {
      id: "3",
      name: "Plank",
      description:
        "A core-strengthening exercise that also engages the shoulders and back.",
      difficulty: Difficulty.EASY,
      muscles: [Muscle.CORE, Muscle.SHOULDERS, Muscle.BACK],
    },
    {
      id: "4",
      name: "Lunges",
      description:
        "A lower body exercise that focuses on the quads and glutes.",
      difficulty: Difficulty.MEDIUM,
      muscles: [Muscle.QUADS, Muscle.GLUTEUS],
    },
    {
      id: "5",
      name: "Bicycle Crunches",
      description: "An abdominal exercise that targets the obliques.",
      difficulty: Difficulty.MEDIUM,
      muscles: [Muscle.CORE, Muscle.BICEPS],
    },
    {
      id: "6",
      name: "Burpees",
      description:
        "A full-body exercise that combines squats, push-ups, and jumps.",
      difficulty: Difficulty.HARD,
      muscles: [Muscle.CHEST, Muscle.TRICEPS, Muscle.QUADS],
    },
    {
      id: "7",
      name: "Pull-Up",
      description: "An upper body exercise that works the back and biceps.",
      difficulty: Difficulty.HARD,
      muscles: [Muscle.BACK, Muscle.BICEPS],
    },
    {
      id: "8",
      name: "Deadlift",
      description:
        "A compound exercise that targets the lower back and hamstrings.",
      difficulty: Difficulty.HARD,
      muscles: [Muscle.BACK, Muscle.HAMSTRINGS],
    },
    {
      id: "9",
      name: "Russian Twists",
      description: "An abdominal exercise that also engages the obliques.",
      difficulty: Difficulty.MEDIUM,
      muscles: [Muscle.CORE, Muscle.BACK],
    },
    {
      id: "10",
      name: "Jumping Jacks",
      description:
        "A cardio exercise that elevates heart rate and works the whole body.",
      difficulty: Difficulty.EASY,
      muscles: [Muscle.BACK, Muscle.CALVES],
    },
  ];
}
