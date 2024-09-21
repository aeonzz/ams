import type { JobRequest, Request, User } from "prisma/generated/zod";

export type RequestJoin = Request & {
  jobRequest: JobRequest | null;
};

export type RequestTableType = Request & {
  user: User;
};
