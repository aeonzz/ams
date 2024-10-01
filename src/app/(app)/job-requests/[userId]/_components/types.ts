import type {
  JobRequestWithRelations,
  UserWithRelations,
} from "prisma/generated/zod";

export type UserJobReportData = {
  user: UserWithRelations;
  requests: JobRequestWithRelations[];
};
