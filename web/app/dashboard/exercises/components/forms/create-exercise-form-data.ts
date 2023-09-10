import { Exercise } from "../../../../../types/entities";
import { Difficulty, Muscle } from "../../../../../types/enums";

export const CREATE_EXERCISE_INITIAL_VALUES: Omit<Exercise, "id"> = {
  name: "",
  description: "",
  difficulty: Difficulty.MEDIUM,
  muscles: [],
};
