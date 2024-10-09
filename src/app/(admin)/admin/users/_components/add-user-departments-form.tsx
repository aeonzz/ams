"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { createUserDepartments } from "@/lib/actions/userDepartments";
import {
  type AddUserDepartmentsSchemaWithPath,
  type AddUserDepartmentsSchema,
} from "./schema";
import { type Department } from "prisma/generated/zod";
import { Badge } from "@/components/ui/badge";

interface AddUserDepartmentsFormProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createUserDepartments>[0],
    unknown
  >;
  form: UseFormReturn<AddUserDepartmentsSchema>;
  isPending: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Department[];
  userId: string;
}

export default function AddUserDepartmentsForm({
  mutateAsync,
  isPending,
  form,
  setOpen,
  data,
  userId,
}: AddUserDepartmentsFormProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  async function onSubmit(values: AddUserDepartmentsSchema) {
    const submitData: AddUserDepartmentsSchemaWithPath = {
      path: pathname,
      departmentIds: values.departmentIds,
      userId: userId,
    };
    toast.promise(mutateAsync(submitData), {
      loading: "Adding user...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["create-user-role-selection-user-table"],
        });
        setOpen(false);
        return "User added successfully";
      },
      error: (err) => {
        return err.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[40vh] flex-col overflow-y-auto">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandList>
              <CommandEmpty>No department found</CommandEmpty>
              <CommandGroup>
                <div className="scroll-bar max-h-40 overflow-y-auto">
                  {data?.map((department) => (
                    <CommandItem
                      value={department.name}
                      key={department.id}
                      onSelect={() => {
                        const currentValue =
                          form.getValues("departmentIds") || [];
                        const updatedValue = currentValue.includes(
                          department.id
                        )
                          ? currentValue.filter((id) => id !== department.id)
                          : [...currentValue, department.id];
                        form.setValue("departmentIds", updatedValue);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form
                            .getValues("departmentIds")
                            ?.includes(department.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {department.name}
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
            <Separator className="mb-1" />
            {form.watch("departmentIds")?.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1">
                {form.watch("departmentIds").map((departmentId) => {
                  const department = data?.find((d) => d.id === departmentId);
                  return department ? (
                    <Badge key={department.id} variant="outline">
                      {department.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-muted-foreground"
                        onClick={() => {
                          form.setValue(
                            "departmentIds",
                            form
                              .getValues("departmentIds")
                              .filter((id) => id !== department.id)
                          );
                        }}
                      >
                        ×
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </Command>
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
              Assign
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
