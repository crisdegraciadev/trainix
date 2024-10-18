import { z } from "zod";

export const ORDER_SCHEMA = z.union([z.literal("asc"), z.literal("desc")]).optional();
export type OrderSchema = z.infer<typeof ORDER_SCHEMA>;
