import type { Department, Vehicle } from "prisma/generated/zod";

export type VehicleTableType = Vehicle & {
  department: Department;
  departmentName: string;
};
