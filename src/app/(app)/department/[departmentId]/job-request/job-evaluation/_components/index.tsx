import React from "react";

import { P } from "@/components/typography/text";
import { type GetJobEvaluation } from "@/lib/schema";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getDepartmentJobEvaluation } from "@/lib/actions/job-evaluation";
import { JobEvaluationTable } from "./job-evaluation-table";

interface JobEvaluationScreenProps {
  departmentId: string;
  searchParams: GetJobEvaluation;
}

export default function JobEvaluationScreen({
  departmentId,
  searchParams,
}: JobEvaluationScreenProps) {
  const jobEvaluationPromise = getDepartmentJobEvaluation({
    ...searchParams,
    departmentId: departmentId,
  });

  return (
    <div className="flex h-full w-full">
      <div className="grid h-auto place-items-center items-center py-3">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={4}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "30rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <JobEvaluationTable jobEvaluationPromise={jobEvaluationPromise} />
        </React.Suspense>
      </div>
    </div>
  );
}
