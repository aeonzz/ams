import type {
  RequestWithRelations,
  UserWithRelations,
} from "prisma/generated/zod";

export type SystemOverViewData = {
  users: UserWithRelations[];
  requests: RequestWithRelations[];
};
