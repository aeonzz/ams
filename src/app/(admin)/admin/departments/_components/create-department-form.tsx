"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Separator } from "../../../../../components/ui/separator";
import { DialogFooter } from "../../../../../components/ui/dialog";
import { SubmitButton } from "../../../../../components/ui/submit-button";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { createDepartment } from "@/lib/actions/department";
import { CreateDepartmentSchema } from "@/lib/schema/department";
import { Switch } from "@/components/ui/switch";

interface CreateDepartmentFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createDepartment>[0],
    unknown
  >;
  form: UseFormReturn<CreateDepartmentSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
}

export default function CreateDepartmentForm({
  setIsOpen,
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
}: CreateDepartmentFormProps) {
  const pathname = usePathname();

  async function onSubmit(values: CreateDepartmentSchema) {
    const data = {
      ...values,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Creating...",
      success: () => {
        setIsOpen(false);
        return "Department created successfully";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative space-y-2 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Information Technology"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="IT"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptsJobs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Accept Jobs</FormLabel>
                  <FormDescription className="text-xs">
                    Receive emails about new products, features, and more.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
                  setIsOpen(false);
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
