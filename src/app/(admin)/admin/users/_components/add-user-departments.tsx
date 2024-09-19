"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
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
import CreateUserRoleForm from "./create-user-role-form";
import {
  addUserDepartmentsSchema,
  type AddUserDepartmentsSchema,
} from "./schema";
import { Department } from "prisma/generated/zod";
import AddUserDepartmentsForm from "./add-user-departments-form";
import { createUserDepartments } from "@/lib/actions/userDepartments";

interface AddUserDepartmentsProps {
  userId: string;
}

export default function AddUserDepartments({
  userId,
}: AddUserDepartmentsProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddUserDepartmentsSchema>({
    resolver: zodResolver(addUserDepartmentsSchema),
    defaultValues: {
      userId: userId,
      departmentIds: undefined,
    },
  });

  const { mutateAsync, isPending } = useServerActionMutation(createUserDepartments);

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["add-user-departments-selection-popover-users-table"],
  });
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <DropdownMenuItem
          disabled={isLoading}
          onSelect={(e) => e.preventDefault()}
          className="flex"
        >
          <span>Add department</span>
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
          <AddUserDepartmentsForm
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
