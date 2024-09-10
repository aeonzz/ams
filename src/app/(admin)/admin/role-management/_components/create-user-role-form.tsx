"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { useQuery, type UseMutateAsyncFunction } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { createUserRole } from "@/lib/actions/userRole";
import {
  type CreateUserRoleSchemaWithPath,
  type CreateUserRoleSchema,
} from "@/lib/schema/userRole";
import axios from "axios";
import { type RoleUserDepartmentData } from "./types";
import InputPopover, { Option } from "./input-popover";

interface CreateUserRoleFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createUserRole>[0],
    unknown
  >;
  form: UseFormReturn<CreateUserRoleSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
}

export default function CreateUserRoleForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
}: CreateUserRoleFormProps) {
  const pathname = usePathname();

  const { data, isLoading } = useQuery<RoleUserDepartmentData>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/user-department-role");
      return res.data.data;
    },
    queryKey: ["create-user-role-selection"],
  });

  async function onSubmit(values: CreateUserRoleSchema) {
    const data: CreateUserRoleSchemaWithPath = {
      path: pathname,
      departmentId: values.departmentId,
      userId: values.userId,
      roleId: values.userId,
    };
    toast.promise(mutateAsync(data), {
      loading: "Creating...",
      success: () => {
        dialogManager.setActiveDialog(null);
        return "User role created successfuly";
      },
      error: (err) => {
        return err.message;
      },
    });
  }
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const { roles, users, departments } = data;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Role</FormLabel>
                <InputPopover
                  title="Role"
                  options={roles}
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>User</FormLabel>
                <InputPopover
                  title="User"
                  options={users.map((user) => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                  }))}
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Department</FormLabel>
                <InputPopover
                  title="Department"
                  options={departments}
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4" />
        <DialogFooter>
          <div></div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                if (isFieldsDirty) {
                  setAlertOpen(true);
                } else {
                  dialogManager.setActiveDialog(null);
                }
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <SubmitButton disabled={isPending} type="submit" className="w-20">
              Create
            </SubmitButton>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
