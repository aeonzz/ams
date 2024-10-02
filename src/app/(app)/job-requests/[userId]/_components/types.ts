import type {
  JobRequestWithRelations,
  UserWithRelations,
} from "prisma/generated/zod";
import type { JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";
import type { JobTypeType } from "prisma/generated/zod/inputTypeSchemas/JobTypeSchema";

export type UserJobReportData = {
  user: UserWithRelations;
  requests: JobRequestWithRelations[];
};

export type JobRequestTableType = {
  requestId: string;
  title: string;
  departmentName: string;
  status: JobStatusType;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  jobType: JobTypeType;
};
