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
