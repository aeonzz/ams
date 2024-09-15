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
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import type { RoleDepartmentData } from "./types";
import CreateUserRoleForm from "./create-user-role-form";

interface CreateUserRoleProps {
  userId: string;
}

export default function CreateUserRole({ userId }: CreateUserRoleProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateUserRoleSchema>({
    resolver: zodResolver(createUserRoleSchema),
    defaultValues: {
      roleId: undefined,
      userId: userId,
      departmentId: undefined,
    },
  });

  const { mutateAsync, isPending } = useServerActionMutation(createUserRole);

  const { data, isLoading } = useQuery<RoleDepartmentData>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/role-department");
      return res.data.data;
    },
    queryKey: ["create-user-role-selection-user-table"],
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <DropdownMenuItem
          disabled={isLoading}
          onSelect={(e) => e.preventDefault()}
          className="flex"
        >
          <span>Assign role</span>
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
          <CreateUserRoleForm
            mutateAsync={mutateAsync}
            isPending={isPending}
            setOpen={setOpen}
            form={form}
            data={data}
            userId={userId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
