import { z } from "zod";

export const createMaintenanceRecordSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Must be at least 10 characters long" })
    .max(600, { message: "Cannot be more than 600 characters long" }),
  odometer: z
    .number({
      required_error: "Odometer value is required",
    })
    .min(1, "Odometer value is required"),
  performedAt: z.date({
    required_error:"Repair date is required"
  })
});

export type CreateMaintenanceRecordSchema = z.infer<
  typeof createMaintenanceRecordSchema
>;

export const createMaintenanceRecordSchemaWithPath =
  createMaintenanceRecordSchema.extend({
    path: z.string(),
    vehicleId: z.string({
      required_error: "Vehicle Id is required",
    }),
  });

export type CreateMaintenanceRecordSchemaWithPath = z.infer<
  typeof createMaintenanceRecordSchemaWithPath
>;
