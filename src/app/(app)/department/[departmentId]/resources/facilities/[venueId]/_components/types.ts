import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type VenueRequestsTableType = {
  id: string;
  requestsTitle: string;
  requestsStatus: RequestStatusTypeType;
  createdAt: Date;
};
