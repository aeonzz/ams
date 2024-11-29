import type { JobRequestEvaluation } from "prisma/generated/zod";

export type DepartmentJobEvaluation = JobRequestEvaluation & {
  requestTitle: string;
  jobRequestId: string;
  requestId: string;
};
