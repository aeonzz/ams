import React from "react";
import type { JobRequestWithRelations } from "prisma/generated/zod";
import RegularJobActions from "./regular-job-actions";
import ReworkJobActions from "./rework-job-actions";

interface PersonnelActionsProps {
  allowedDepartment?: string;
  allowedRoles: string[];
  requestId: string;
  data: JobRequestWithRelations;
}

export default function PersonnelActions({
  allowedRoles,
  allowedDepartment,
  requestId,
  data,
}: PersonnelActionsProps) {
  return (
    <RegularJobActions
      allowedRoles={allowedRoles}
      allowedDepartment={allowedDepartment}
      requestId={requestId}
      data={data}
    />
  );
}
