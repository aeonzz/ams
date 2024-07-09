import { string, z } from "zod";

export const imageSchema = z.object({
  filename: string().min(1),
});
