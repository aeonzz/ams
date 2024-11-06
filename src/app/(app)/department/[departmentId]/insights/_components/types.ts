import type {
  RequestWithRelations,
  UserDepartmentWithRelations,
} from "prisma/generated/zod";

export type DepartmentOverViewData = {
  users: UserDepartmentWithRelations[];
  requests: RequestWithRelations[];
};
