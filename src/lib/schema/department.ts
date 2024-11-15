import { DepartmentTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

const baseDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .max(30, "Cannot be more than 30 characters long"),
  description: z.string().optional(),
  acceptsJobs: z.boolean().default(false).optional(),
  managesTransport: z.boolean().default(false).optional(),
  managesBorrowRequest: z.boolean().default(false).optional(),
  managesSupplyRequest: z.boolean().default(false).optional(),
  managesFacility: z.boolean().default(false).optional(),
  responsibilities: z.string().optional(),
  departmentType: DepartmentTypeSchema,
  path: z.string(),
});

export const createDepartmentSchema = baseDepartmentSchema.refine(
  (data) => !data.acceptsJobs || data.responsibilities !== undefined,
  {
    path: ["responsibilities"],
    message: "Responsibilities are required if accepting jobs",
  }
);
// .refine(
//   (data) =>
//     !data.managesBorrowRequest || data.maxBorrowDuration !== undefined,
//   {
//     path: ["maxBorrowDuration"],
//     message: "Max Borrow Duration is required",
//   }
// )
// .refine(
//   (data) => !data.managesBorrowRequest || data.gracePeriod !== undefined,
//   {
//     path: ["gracePeriod"],
//     message: "Grace Period is required",
//   }
// );

export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;

const baseUpdateDepartmentSchema = baseDepartmentSchema.partial();

export const updateDepartmentSchema = baseUpdateDepartmentSchema
  .extend({
    departmentId: z.string().min(1, "Department id is required"),
  })
  .refine(
    (data) =>
      !data.acceptsJobs ||
      (data.responsibilities && data.responsibilities.length > 0),
    {
      path: ["responsibilities"],
      message: "Responsibilities are required if acceptsJobs is true",
    }
  );
// .refine(
//   (data) =>
//     !data.managesBorrowRequest || data.maxBorrowDuration !== undefined,
//   {
//     path: ["maxBorrowDuration"],
//     message:
//       "Max Borrow Duration is required if managesBorrowRequest is true",
//   }
// )
// .refine(
//   (data) => !data.managesBorrowRequest || data.gracePeriod !== undefined,
//   {
//     path: ["gracePeriod"],
//     message: "Grace Period is required if managesBorrowRequest is true",
//   }
// );

export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;

// export const updateDepartmentSchema = z.object({
//   name: z.string().optional(),
//   description: z.string().optional(),
//   acceptsJobs: z.boolean().optional(),
//   managesTransport: z.boolean().optional(),
//   responsibilities: z.string().optional(),
//   departmentType: DepartmentTypeSchema.optional(),
// });

// export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;

// export const extendedUpdateDepartmentSchema = updateDepartmentSchema.extend({
//   path: z.string(),
//   id: z.string().optional(),
// });

export const deleteDepartmentsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteDepartmentsSchema = z.infer<typeof deleteDepartmentsSchema>;

export const createDepartmentBorrowingPolicySchema = z.object({
  maxBorrowDuration: z
    .number()
    .int()
    .min(1, "Maximum borrow duration is required"),
  penaltyBorrowBanDuration: z.number().int().optional(),
  gracePeriod: z.number().int().min(1, "Grace period duration is required"),
  other: z.string().optional(),
});

export type CreateDepartmentBorrowingPolicySchema = z.infer<
  typeof createDepartmentBorrowingPolicySchema
>;

export const createDepartmentBorrowingPolicySchemaWithPath =
  createDepartmentBorrowingPolicySchema.extend({
    path: z.string(),
  });

export type CreateDepartmentBorrowingPolicySchemaWithPath = z.infer<
  typeof createDepartmentBorrowingPolicySchemaWithPath
>;
