"use client";
"use memo";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { useDataTable } from "@/lib/hooks/use-data-table";
import { type DataTableFilterField } from "@/lib/types";
import { getRoleColumns } from "./role-management-table-columns";
import { getRoles } from "@/lib/actions/role";
import type { RoleType } from "@/lib/types/role";
import { RoleManagementTableFloatingBar } from "./role-management-table-floating-bar";
import { RoleManagementTableToolbarActions } from "./role-management-table-toolbar-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BuildingIcon, CalendarIcon, UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { H4, P } from "@/components/typography/text";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface RoleManagementTableProps {
  roleManagementPromise: ReturnType<typeof getRoles>;
}

export function RoleManagementTable({
  roleManagementPromise,
}: RoleManagementTableProps) {
  const { data, pageCount } = React.use(roleManagementPromise);
  console.log(data);

  const columns = React.useMemo(() => getRoleColumns(), []);

  const filterFields: DataTableFilterField<RoleType>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
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

  return (
    <DataTable
      table={table}
      floatingBar={<RoleManagementTableFloatingBar table={table} />}
      renderSubComponent={({ row }) => (
        <Card className="m-4 bg-secondary">
          <CardContent className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                <H4 className="font-semibold">
                  User Roles for {row.original.name}
                </H4>
              </div>
              <Link
                href={""}
                className={cn(buttonVariants({ variant: "link", size: "sm" }))}
              >
                See all
              </Link>
            </div>
            <div className="scroll-bar h-[300px] overflow-y-auto rounded-md border p-4">
              {row.original.userRoles.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <P className="text-muted-foreground">
                    No User Roles assigned
                  </P>
                </div>
              ) : (
                <div className="space-y-6">
                  {row.original.userRoles.map((userRole) => (
                    <div
                      key={userRole.id}
                      className="flex items-start space-x-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={userRole.user.profileUrl || undefined}
                          alt={userRole.user.username}
                        />
                        <AvatarFallback>
                          {userRole.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h5 className="text-sm font-medium">
                          {userRole.user.username}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {userRole.user.email}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <BuildingIcon className="h-3 w-3" />
                            <span>{userRole.department.name}</span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              Joined{" "}
                              {new Date(
                                userRole.user.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <RoleManagementTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
