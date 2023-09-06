import { Difficulty, Muscle } from "../enums";

export type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  muscles: Muscle[];
};
