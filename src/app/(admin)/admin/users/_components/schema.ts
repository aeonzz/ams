import { z } from "zod";

export const addUserDepartmentsSchema = z.object({
  userId: z.string({
    required_error: "User is required",
  }),
  departmentIds: z
    .array(z.string(), {
      required_error: "Department is required",
    })
    .min(1, "At least one department is required"),
});

export type AddUserDepartmentsSchema = z.infer<typeof addUserDepartmentsSchema>;

export const addUserDepartmentsSchemaWithPath = addUserDepartmentsSchema.extend(
  {
    path: z.string(),
  }
);

export type AddUserDepartmentsSchemaWithPath = z.infer<
  typeof addUserDepartmentsSchemaWithPath
>;
