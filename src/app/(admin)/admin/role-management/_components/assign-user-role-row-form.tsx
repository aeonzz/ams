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
import { DialogFooter } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { type UseMutateAsyncFunction } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { createUserRole } from "@/lib/actions/userRole";
import {
  type CreateUserRoleSchemaWithPath,
  type CreateUserRoleSchema,
} from "@/lib/schema/userRole";
import type { UserDepartmentData } from "./types";
import InputPopover, { Option } from "../../../../../components/input-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn, formatFullName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface AssignUserRoleRowFormProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createUserRole>[0],
    unknown
  >;
  form: UseFormReturn<CreateUserRoleSchema>;
  isPending: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: UserDepartmentData;
  roleId: string;
}

export default function AssignUserRoleRowForm({
  mutateAsync,
  isPending,
  form,
  setOpen,
  data,
  roleId,
}: AssignUserRoleRowFormProps) {
  const pathname = usePathname();

  async function onSubmit(values: CreateUserRoleSchema) {
    const data: CreateUserRoleSchemaWithPath = {
      path: pathname,
      departmentId: values.departmentId,
      userIds: values.userIds,
      roleId: roleId,
    };
    toast.promise(mutateAsync(data), {
      loading: "Creating...",
      success: () => {
        setOpen(false);
        return "User role created successfuly";
      },
      error: (err) => {
        return err.message;
      },
    });
  }

  const { users, departments } = data;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col overflow-y-auto">
          <FormField
            control={form.control}
            name="userIds"
            render={({ field }) => (
              <FormItem className="flex-1">
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
          <Separator className="mb-1" />
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
        <Separator className="mt-1" />
        <DialogFooter className="p-1">
          <div className="flex w-full gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isPending}
              type="submit"
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
