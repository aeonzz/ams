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
  setupRequirements: z.array(z.string()).optional(),
  status: VenueStatusSchema.optional(),
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

export const updateVenueSchemaServer = createVenueSchemaServer.partial();

export const extendedUpdateVenueServerSchema = updateVenueSchemaServer.extend({
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

export const updateSetupRequirementSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  path: z.string(),
});

export type UpdateSetupRequirementSchema = z.infer<
  typeof updateSetupRequirementSchema
>;
