import { Activity, Workout } from "@/types/entities";
import { Category, Difficulty, Muscle } from "@/types/enums";
import { ZodType, z } from "zod";

type CreateActivitySchema = Omit<Activity, "id">;

const createActivitySchema: ZodType<CreateActivitySchema> = z.object({
  exerciseId: z.string(),
  reps: z.number(),
  sets: z.number(),
});

export type CreateWorkoutSchema = Omit<Workout, "id" | "activities"> & {
  activities: CreateActivitySchema[];
};

export const createWorkoutSchema: ZodType<CreateWorkoutSchema> = z.object({
  name: z.string().min(1, "Name is a mandatory field"),
  description: z.string().min(1, "Description is a mandatory field"),
  difficulty: z.nativeEnum(Difficulty),
  category: z.nativeEnum(Category),
  activities: z.array(createActivitySchema),
  muscles: z
    .array(z.nativeEnum(Muscle))
    .min(1, "At least 1 muscle must be selected"),
});
