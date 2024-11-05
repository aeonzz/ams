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
  if (data.rejectionCount === 0) {
    return (
      <RegularJobActions
        allowedRoles={allowedRoles}
        allowedDepartment={allowedDepartment}
        requestId={requestId}
        data={data}
      />
    );
  } else {
    const hasUnfinishedRework = data.reworkAttempts.some(attempt => !attempt.status);
    if (hasUnfinishedRework) {
      return (
        <ReworkJobActions
          allowedRoles={allowedRoles}
          allowedDepartment={allowedDepartment}
          requestId={requestId}
          data={data}
        />
      );
    }
    return null;
  }
}