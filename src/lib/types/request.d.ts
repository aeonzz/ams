import { JobRequest, Request } from "prisma/generated/zod";

export type RequestJoin = Request & {
  jobRequest: JobRequest | null;
};
