import type { JobRequestEvaluation } from "prisma/generated/zod";

export type DepartmentJobEvaluation = Omit<JobRequestEvaluation, "id"> & {
  requestTitle: string;
  jobRequestId: string;
  requestId: string;
};
