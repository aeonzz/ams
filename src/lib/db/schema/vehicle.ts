import { VehicleStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createVehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  departmentId: z.string({
    required_error: "Department is required",
  }),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  capacity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, "Capacity is required")),
  licensePlate: z.string().min(1, "Name is required"),
});

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  departmentId: z.string().optional(),
  capacity: z.preprocess((val) => Number(val), z.number().optional()),
  status: VehicleStatusSchema,
  licensePlate: z.string().optional(),
  imageUrl: z.array(z.instanceof(File)).optional(),
});

export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>;

export const extendedUpdateVehicleSchema = updateVehicleSchema.extend({
  path: z.string(),
  id: z.string().optional(),
});
