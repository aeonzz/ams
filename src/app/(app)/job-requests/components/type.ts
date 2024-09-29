import type { JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";

export type JobRequestsTableType = {
  id: string;
  title: string;
  department: string;
  dueDate: Date;
  jobStatus: JobStatusType;
  estimatedTime: number | null;
};
