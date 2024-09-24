import { ChangeTypeSchema, VehicleStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createVehicleSchemaServer = z.object({
  name: z.string(),
  type: z.string(),
  departmentId: z.string(),
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

export const updateVehicleSchemaServer = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  departmentId: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
  capacity: z.number().optional(),
  licensePlate: z.string().optional(),
  status: VehicleStatusSchema.optional(),
});

export const extendedUpdateVehicleServerSchema =
  updateVehicleSchemaServer.extend({
    changeType: ChangeTypeSchema,
    path: z.string(),
    id: z.string().optional(),
  });

export type ExtendedUpdateVehicleServerSchema = z.infer<
  typeof extendedUpdateVehicleServerSchema
>;

export const updateVehicleStatusesSchema = z.object({
  ids: z.string().array(),
  status: VehicleStatusSchema.optional(),
  path: z.string(),
});

export type UpdateVehicleStatusesSchema = z.infer<
  typeof updateVehicleStatusesSchema
>;

export const deleteVehiclesSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteVehiclesSchema = z.infer<typeof deleteVehiclesSchema>;
