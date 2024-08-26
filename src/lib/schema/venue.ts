import { z } from "zod";

export const createVenueSchemaServer = z.object({
  name: z.string(),
  location: z.string(),
  capacity: z.number(),
  imageUrl: z.array(z.string({
    required_error: "Image is required"
  }))
});

export const createVenueSchemaWithPath = createVenueSchemaServer.extend({
  path: z.string(),
});

export type CreateVenueSchemaWithPath = z.infer<
  typeof createVenueSchemaWithPath
>;
