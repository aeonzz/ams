import { Department, User } from "prisma/generated/zod";

export type DepartmentsTableType = Department & {
  user: User[];
};
