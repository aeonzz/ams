import type { Venue, Department } from "prisma/generated/zod";

export type VenueTableType = Venue & {
  department: Department;
  departmentName: string;
};
