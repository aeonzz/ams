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
import {
  type CreateUserRoleSchemaWithPath,
  type CreateUserRoleSchema,
} from "@/lib/schema/userRole";
import axios from "axios";
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
import type { UsersAndSections } from "./types";
import InputPopover from "@/components/input-popover";
import { type AssignUserSchemaWithPath, type AssignUserSchema } from "./schema";
import { assignSection } from "@/lib/actions/job";
import AssignUserFormSkeleton from "./assign-user-form-skeleton";

interface AssignUserFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof assignSection>[0],
    unknown
  >;
  form: UseFormReturn<AssignUserSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
}

export default function AssignUserForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
}: AssignUserFormProps) {
  const pathname = usePathname();

  const { data, isLoading } = useQuery<UsersAndSections>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/section-assignment");
      return res.data.data;
    },
    queryKey: ["assign-user-section-selection"],
  });

  async function onSubmit(values: AssignUserSchema) {
    const data: AssignUserSchemaWithPath = {
      path: pathname,
      userId: values.userId,
      sectionId: values.sectionId,
    };
    toast.promise(mutateAsync(data), {
      loading: "Adding...",
      success: () => {
        dialogManager.setActiveDialog(null);
        return "User added successfuly";
      },
      error: (err) => {
        return err.message;
      },
    });
  }

  if (isLoading || !data) {
    return <AssignUserFormSkeleton />;
  }

  const { users, sections } = data;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Command className="max-h-[200px]">
                    <CommandInput placeholder={`Search user...`} />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              form.setValue("userId", user.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === user.id
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
            name="sectionId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Section</FormLabel>
                <InputPopover
                  title="Section"
                  options={sections}
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
