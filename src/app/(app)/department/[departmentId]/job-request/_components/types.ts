import type { JobRequest } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type DepartmentJobRequest = JobRequest & {
  id: string;
  completedAt: Date | null;
  title: string;
  rejectionReason?: string;
  requester: string;
  reviewer?: string;
  requestStatus: RequestStatusTypeType;
  createdAt: Date;
  updatedAt: Date;
};
