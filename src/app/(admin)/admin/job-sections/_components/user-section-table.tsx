"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { P } from "@/components/typography/text";
import type { FormattedSectionUsers } from "./types";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { unassignSection } from "@/lib/actions/job";
import { toast } from "sonner";
import { type UnassignUserWithPath } from "./schema";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserSectionTableProps {
  users: FormattedSectionUsers[];
}

export default function UserSectionTable({ users }: UserSectionTableProps) {
  const pathname = usePathname();
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<FormattedSectionUsers>[] = React.useMemo(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
      },
      {
        accessorKey: "middleName",
        header: "Middle Name",
        cell: ({ row }) => <div>{row.getValue("middleName")}</div>,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
      },
      {
        accessorKey: "departmentName",
        header: "department",
        cell: ({ row }) => <div>{row.getValue("departmentName")}</div>,
      },
      {
        id: "actions",

        cell: function Cell({ row }) {
          const [alertOpen, setAlertOpen] = React.useState(false);
          const { isPending, mutateAsync } =
            useServerActionMutation(unassignSection);

          return (
            <div className="grid place-items-center">
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger disabled={isPending} asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setAlertOpen(true)}
                  >
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this user? This action
                      cannot be undone. The user will lose access to all
                      associated data and permissions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setAlertOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isPending}
                      onClick={async () => {
                        toast.promise(
                          mutateAsync({
                            path: pathname,
                            userId: row.original.id,
                          }),
                          {
                            loading: "Removing...",
                            success: () => {
                              return "User removed successfuly";
                            },
                            error: (err) => {
                              return err.message;
                            },
                          }
                        );
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
    },
  });

  const filteredSubItems = table.getFilteredRowModel().rows;

  return (
    <div className="m-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-3">
          <P>Total: {filteredSubItems.length} Items</P>
        </div>
      </div>
      <div className="scroll-bar max-h-[420px] overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
