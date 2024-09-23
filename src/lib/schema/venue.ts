import {
  ChangeTypeSchema,
  VenueStatusSchema,
  VenueTypeSchema,
} from "prisma/generated/zod";
import { z } from "zod";

export const createVenueSchemaServer = z.object({
  name: z.string(),
  location: z.string(),
  departmenId: z.string(),
  capacity: z.number(),
  venueType: VenueTypeSchema,
  features: z.array(z.string()).optional(),
  imageUrl: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
});

export const createVenueSchemaWithPath = createVenueSchemaServer.extend({
  path: z.string(),
});

export type CreateVenueSchemaWithPath = z.infer<
  typeof createVenueSchemaWithPath
>;

export const updateVenueSchemaServer = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  departmentId: z.string().optional(),
  venueType: VenueTypeSchema.optional(),
  features: z.array(z.string()).optional(),
  capacity: z.number().optional(),
  imageUrl: z.array(z.string()).optional(),
  status: VenueStatusSchema.optional(),
});

export const extendedUpdateVenueServerSchema = updateVenueSchemaServer.extend({
  changeType: ChangeTypeSchema,
  path: z.string(),
  id: z.string().optional(),
});

export type ExtendedUpdateVenueServerSchema = z.infer<
  typeof extendedUpdateVenueServerSchema
>;

export const updateVenueStatusesSchema = z.object({
  ids: z.string().array(),
  status: VenueStatusSchema.optional(),
  path: z.string(),
});

export type UpdateVenueStatusesSchema = z.infer<
  typeof updateVenueStatusesSchema
>;

export const deleteVenuesSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteVenuesSchema = z.infer<typeof deleteVenuesSchema>;
