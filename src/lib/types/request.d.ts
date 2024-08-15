import { JobRequest, Request } from "prisma/generated/zod";

export type RequestJoin = Request & {
  jobRequest: JobRequest | null;
};

export type RequestsFilter = {
  data: Request[],
  pageCount: number,
}