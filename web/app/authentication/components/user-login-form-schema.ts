import { ZodType, z } from "zod";

export type UserLoginSchema = { email: string; password: string };

export const userLoginSchema: ZodType<UserLoginSchema> = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
