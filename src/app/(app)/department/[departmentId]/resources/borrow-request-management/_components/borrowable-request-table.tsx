"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { DepartmentBorrowableRequest } from "./types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { P } from "@/components/typography/text";
import { getDepartmentBorrowableRequests } from "@/lib/actions/inventory";
import { getBorrowableRequestColumns } from "./borrowable-request-table-columns";
import { BorrowableRequestTableFloatingBar } from "./borrowable-request-table-floating-bar";
import { BorrowableRequestTableToolbarActions } from "./borrowable-request-table-toolbar-actions";

interface BorrowableRequestTableProps {
  borrowableRequestPromise: ReturnType<typeof getDepartmentBorrowableRequests>;
  departmentId: string;
}

export function BorrowableRequestTable({
  borrowableRequestPromise,
  departmentId,
}: BorrowableRequestTableProps) {
  const { data, pageCount, department } = React.use(borrowableRequestPromise);

  const columns = React.useMemo(() => getBorrowableRequestColumns(), []);

  const filterFields: DataTableFilterField<DepartmentBorrowableRequest>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter title...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  //   const formattedData = allRequest?.map((request) => ({
  //     requestId: request.request.id,
  //     title: request.request.title,
  //     status: request.request.status,
  //     createdAt: request.request.createdAt,
  //     actualStart: request.actualStart,
  //     completedAt: request.request.completedAt,
  //     dateAndTimeNeeded: request.dateAndTimeNeeded,
  //   }));

  return (
    <DataTable
      table={table}
      floatingBar={
        <BorrowableRequestTableFloatingBar
          table={table}
          fileName={`${department?.name} Borrow Requests`}
        />
      }
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <BorrowableRequestTableToolbarActions
          table={table}
          fileName={`${department?.name} Borrow Requests`}
        >
          <Link
            prefetch
            className={cn(buttonVariants({ variant: "ghost2", size: "sm" }))}
            href={`/department/${departmentId}/resources/borrow-request-management/items`}
          >
            <P>Items</P>
          </Link>
        </BorrowableRequestTableToolbarActions>
      </DataTableToolbar>
    </DataTable>
  );
}
