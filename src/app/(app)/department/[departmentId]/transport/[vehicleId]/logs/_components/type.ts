import type { GenericAuditLogRelations } from "prisma/generated/zod";

export type VehicleAuditLogTableType = GenericAuditLogRelations & {
  firstName: string;
  middleName: string | null;
  lastName: string;
};
