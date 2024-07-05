import { z } from "zod";

const urlSchema = z.string().url().min(1);

export const fileSchema = z.object({
  urls: z.array(urlSchema),
});
