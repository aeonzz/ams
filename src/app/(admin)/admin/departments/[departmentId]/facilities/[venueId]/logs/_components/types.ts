import type { GenericAuditLogRelations } from "prisma/generated/zod";

export type VenueAuditLogTableType = GenericAuditLogRelations & {
  firstName: string;
  middleName: string | null;
  lastName: string;
};
