"use client";

import { type Table } from "@tanstack/react-table";

import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import type { UserType } from "@/lib/types/user";

interface DepartmentUsersTableToolbarActionsProps {
  table: Table<UserType>;
}

export function DepartmentUsersTableToolbarActions({
  table,
}: DepartmentUsersTableToolbarActionsProps) {
  const dialogManager = useDialogManager();
  return <div className="flex items-center gap-2"></div>;
}
