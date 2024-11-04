import type {
  Venue,
  Department,
  VenueSetupRequirement,
} from "prisma/generated/zod";

export type VenueTableType = Venue & {
  venueSetupRequirement: VenueSetupRequirement[];
  department: Department;
  departmentName: string;
};
