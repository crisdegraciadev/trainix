import { Workout } from "../types/entities";
import { Category, Difficulty, Muscle } from "../types/enums";

export async function fetchWorkouts(): Promise<Workout[]> {
  return [
    {
      id: "1",
      name: "Upper Body Strength",
      description: "A workout focused on building strength in your upper body.",
      difficulty: Difficulty.MEDIUM,
      category: Category.UPPER,
      muscles: [Muscle.CHEST, Muscle.BICEPS, Muscle.SHOULDERS],
    },
    {
      id: "2",
      name: "Leg Day Challenge",
      description:
        "A challenging leg workout to build powerful quads and hamstrings.",
      difficulty: Difficulty.HARD,
      category: Category.LOWER,
      muscles: [Muscle.QUADS, Muscle.HAMSTRINGS, Muscle.GLUTEUS],
    },
    {
      id: "3",
      name: "Core Sculpting",
      description:
        "A core-focused workout to strengthen your abs and obliques.",
      difficulty: Difficulty.MEDIUM,
      category: Category.ABS,
      muscles: [Muscle.CORE],
    },
    {
      id: "4",
      name: "Cardio Blast",
      description:
        "A high-intensity cardio workout to boost your cardiovascular endurance.",
      difficulty: Difficulty.HARD,
      category: Category.CARDIO,
      muscles: [Muscle.CALVES],
    },
    {
      id: "5",
      name: "Full Body Circuit",
      description:
        "An intense full-body circuit training to target multiple muscle groups.",
      difficulty: Difficulty.MEDIUM,
      category: Category.FULL_BODY,
      muscles: [Muscle.CHEST, Muscle.BACK, Muscle.SHOULDERS, Muscle.TRICEPS],
    },
    {
      id: "6",
      name: "Strength and Tone",
      description:
        "A workout designed to build strength and tone your muscles.",
      difficulty: Difficulty.MEDIUM,
      category: Category.UPPER,
      muscles: [Muscle.CHEST, Muscle.BICEPS, Muscle.SHOULDERS],
    },
    {
      id: "7",
      name: "Lower Body Sculpt",
      description: "A lower body workout for sculpting your legs and gluteus.",
      difficulty: Difficulty.HARD,
      category: Category.LOWER,
      muscles: [Muscle.QUADS, Muscle.HAMSTRINGS, Muscle.GLUTEUS],
    },
    {
      id: "8",
      name: "Abdominal Burn",
      description:
        "An intense abdominal workout to burn those stubborn belly fats.",
      difficulty: Difficulty.HARD,
      category: Category.ABS,
      muscles: [Muscle.CORE],
    },
    {
      id: "9",
      name: "High-Intensity Cardio",
      description:
        "A high-intensity cardio session to boost your fitness level.",
      difficulty: Difficulty.HARD,
      category: Category.CARDIO,
      muscles: [Muscle.CALVES],
    },
    {
      id: "10",
      name: "Total Body Conditioning",
      description:
        "A total body conditioning workout for a fit and healthy body.",
      difficulty: Difficulty.MEDIUM,
      category: Category.FULL_BODY,
      muscles: [Muscle.CHEST, Muscle.BACK, Muscle.SHOULDERS, Muscle.TRICEPS],
    },
  ];
}
