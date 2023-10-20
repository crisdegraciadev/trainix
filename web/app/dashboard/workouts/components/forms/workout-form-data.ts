import { Workout } from "@/types/entities";
import { Category, Difficulty } from "@/types/enums";

export const CREATE_WORKOUT_INITIAL_VALUES: Omit<Workout, "id"> = {
  name: "",
  description: "",
  difficulty: Difficulty.MEDIUM,
  category: Category.FULL_BODY,
  activities: [],
  muscles: [],
};
