import { z } from "zod";

export const createVehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  capacity: z.string().transform((val) => parseInt(val, 10)).pipe(
    z.number().min(1, "Capacity is required")
  ),
  licensePlate: z.string().min(1, "Name is required"),
});

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>;
