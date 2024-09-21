"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  createUserRoleSchema,
  type CreateUserRoleSchema,
} from "@/lib/schema/userRole";
import { createUserRole } from "@/lib/actions/userRole";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { UserDepartmentData } from "./types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AssignUserRoleRowForm from "./assign-user-role-row-form";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface AssignUserRoleRowPopoverProps {
  roleId: string;
}

export default function AssignUserRoleRowPopover({
  roleId,
}: AssignUserRoleRowPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateUserRoleSchema>({
    resolver: zodResolver(createUserRoleSchema),
    defaultValues: {
      roleId: roleId,
      userIds: undefined,
      departmentId: undefined,
    },
  });

  const { mutateAsync, isPending } = useServerActionMutation(createUserRole);

  const { data, isLoading } = useQuery<UserDepartmentData>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/user-department-role");
      return res.data.data;
    },
    queryKey: ["assign-user-role-selection"],
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <DropdownMenuItem
          disabled={isLoading}
          onSelect={(e) => e.preventDefault()}
          className="flex"
        >
          <span>Assign to user</span>
          {isLoading && <LoadingSpinner className="ml-auto" />}
        </DropdownMenuItem>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
        className="p-0"
        align="start"
        side="left"
      >
        {isLoading || !data ? null : (
          <AssignUserRoleRowForm
            mutateAsync={mutateAsync}
            isPending={isPending}
            setOpen={setOpen}
            form={form}
            data={data}
            roleId={roleId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
