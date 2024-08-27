import { z } from "zod";

export const createVehicleSchemaServer = z.object({
  name: z.string(),
  type: z.string(),
  imageUrl: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
  capacity: z.number(),
  licensePlate: z.string(),
});

export const createVehicleSchemaWithPath = createVehicleSchemaServer.extend({
  path: z.string(),
});

export type CreateVehicleSchemaWithPath = z.infer<
  typeof createVehicleSchemaWithPath
>;
