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
import InputPopover, { Option } from "../../../../../components/input-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, formatFullName } from "@/lib/utils";
import CreateUserRoleFormSkeleton from "./create-user-role-form-skeleton";

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
      userIds: values.userIds,
      roleId: values.roleId,
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
    return <CreateUserRoleFormSkeleton />;
  }

  const { roles, users, departments } = data;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="userIds"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Command className="max-h-[200px]">
                    <CommandInput placeholder={`Search user...`} />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        <div className="scroll-bar max-h-40 overflow-y-auto">
                          {users?.map((user) => (
                            <CommandItem
                              value={user.id}
                              key={user.id}
                              onSelect={() => {
                                const currentValue =
                                  form.getValues("userIds") || [];
                                const updatedValue = currentValue.includes(
                                  user.id
                                )
                                  ? currentValue.filter((id) => id !== user.id)
                                  : [...currentValue, user.id];
                                form.setValue("userIds", updatedValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.getValues("userIds")?.includes(user.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {formatFullName(
                                user.firstName,
                                user.middleName,
                                user.lastName
                              )}
                            </CommandItem>
                          ))}
                        </div>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
