import { VenueStatusSchema, VenueTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  departmentId: z.string({
    required_error: "Department is required",
  }),
  venueType: VenueTypeSchema,
  capacity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, "Capacity is required")),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  setupRequirements: z
    .array(z.string().max(50, "Item cannot exceed 50 characters"))
    .optional(),
  status: VenueStatusSchema.optional(),
  // rulesAndRegulations: z.array(z.instanceof(File)).optional(),
});

export type CreateVenueSchema = z.infer<typeof createVenueSchema>;

export const updateVenueSchema = createVenueSchema.partial();

export type UpdateVenueSchema = z.infer<typeof updateVenueSchema>;

export const extendedUpdateVenueSchema = updateVenueSchema.extend({
  path: z.string(),
  id: z.string().optional(),
});
