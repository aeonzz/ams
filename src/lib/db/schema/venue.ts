import { VenueStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.string().transform((val) => parseInt(val, 10)).pipe(
    z.number().min(1, "Capacity is required")
  ),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
});

export type CreateVenueSchema = z.infer<typeof createVenueSchema>;

export const updateVenueSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().optional(),
  imageUrl: z.array(z.instanceof(File)).optional(),
  status: VenueStatusSchema
});

export type UpdateVenueSchema = z.infer<typeof updateVenueSchema>;

export const extendedUpdateVenueSchema = updateVenueSchema.extend({
  path: z.string(),
  id: z.string().optional(),
});


