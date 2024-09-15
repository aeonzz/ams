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
import type { RoleDepartmentData } from "./types";
import { assignSection } from "@/lib/actions/job";
import {
  type AssignUserSchemaWithPath,
  type AssignUserSchema,
} from "../../job-sections/_components/schema";
import { type Section } from "prisma/generated/zod";
import { Separator } from "@/components/ui/separator";

interface AddSectionFormProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof assignSection>[0],
    unknown
  >;
  form: UseFormReturn<AssignUserSchema>;
  isPending: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Section[];
  userId: string;
}

export default function AddSectionForm({
  mutateAsync,
  isPending,
  form,
  setOpen,
  data,
  userId,
}: AddSectionFormProps) {
  const pathname = usePathname();

  async function onSubmit(values: AssignUserSchema) {
    const data: AssignUserSchemaWithPath = {
      path: pathname,
      userId: userId,
      sectionId: values.sectionId,
    };
    toast.promise(mutateAsync(data), {
      loading: "Adding...",
      success: () => {
        setOpen(false);
        return "User added to section succesfuly";
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
          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Command className="max-h-[200px]">
                    <CommandInput placeholder={`Search section...`} />
                    <CommandList>
                      <CommandEmpty>No sections found.</CommandEmpty>
                      <CommandGroup>
                        {data.map((section) => (
                          <CommandItem
                            key={section.id}
                            onSelect={() => {
                              form.setValue("sectionId", section.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === section.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {section.name}
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
        </div>
        <Separator />
        <DialogFooter className="p-1">
          <div className="flex gap-1 w-full">
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
              Add
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
