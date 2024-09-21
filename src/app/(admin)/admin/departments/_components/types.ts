import type { Department, User, UserDepartment } from "prisma/generated/zod";

export type UserWithRole = User & {
  role: string;
};

export type DepartmentsTableType = Department & {
  users: UserWithRole[];
};
