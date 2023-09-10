import { ZodType, z } from "zod";
import { Difficulty, Muscle } from "../../../../../types/enums";
import { Exercise } from "../../../../../types/entities";

export type CreateExerciseSchema = Omit<Exercise, "id">;

export const createExerciseSchema: ZodType<CreateExerciseSchema> = z.object({
  name: z.string().min(1, "Name is a mandatory field"),
  description: z.string().min(1, "Description is a mandatory field"),
  difficulty: z.nativeEnum(Difficulty),
  muscles: z
    .array(z.nativeEnum(Muscle))
    .min(1, "At least 1 muscle must be selected"),
});
