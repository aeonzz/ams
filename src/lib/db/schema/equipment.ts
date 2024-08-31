import { ReturnableItemStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  serialNumber: z.string().optional(),
});

export type CreateEquipmentSchema = z.infer<typeof createEquipmentSchema>;
