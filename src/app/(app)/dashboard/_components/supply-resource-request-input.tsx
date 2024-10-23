"use client";

import { createSupplyResourceRequest } from "@/lib/actions/resource";
import {
  ExtendedSupplyResourceRequestSchema,
  type SupplyResourceRequestSchema,
} from "@/lib/schema/resource/supply-resource";
import {
  UseMutateAsyncFunction,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import DateTimePicker from "@/components/ui/date-time-picker";
import { Textarea } from "@/components/ui/text-area";
import type {
  DepartmentWithRelations,
  SupplyItemWithRelations,
} from "prisma/generated/zod";
import { useSupplyItemCategory } from "@/lib/hooks/use-supply-item-category";
import SupplyResourceRequestSkeleton from "./supply-resource-request-skeleton";
import SupplyItemsField from "./supply-items-field";
import FetchDataError from "@/components/card/fetch-data-error";
import { useSupplyResourceData } from "@/lib/hooks/use-supply-resource-data";

interface SupplyResourceRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createSupplyResourceRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<SupplyResourceRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function SupplyResourceRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: SupplyResourceRequestInputProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [selectedDepartmentId, setSelectedDepartmentId] =
    React.useState<string>();

  const {
    supplyData,
    isSupplyDataLoading,
    isErrorSupplyData,
    refetchSupplyData,
    categories,
    isCategoriesLoading,
    isErrorCategories,
  } = useSupplyResourceData();

  const handleDepartmentIdChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  };

  async function onSubmit(values: SupplyResourceRequestSchema) {
    if (!selectedDepartmentId) return;
    const data: ExtendedSupplyResourceRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      departmentId: selectedDepartmentId,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Submitting...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-dashboard-overview"],
        });
        handleOpenChange(false);
        return "Your request has been submitted and is awaiting approval.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  const isLoading = isSupplyDataLoading || isCategoriesLoading;
  const isError = isErrorCategories || isErrorSupplyData;

  if (isLoading) return <SupplyResourceRequestSkeleton />;
  if (isError || !supplyData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetchSupplyData} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
          <div className="flex w-full flex-col space-y-2">
            <SupplyItemsField
              isPending={isPending}
              form={form}
              items={supplyData.items}
              departments={supplyData.departments}
              categories={categories}
              onDepartmentIdChange={handleDepartmentIdChange}
            />
            <DateTimePicker
              form={form}
              name="dateAndTimeNeeded"
              label="Date and Time needed"
              disabled={isPending}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem className="flex flex-grow flex-col">
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={1}
                      maxRows={5}
                      placeholder="Purpose..."
                      className="min-h-[100px] flex-grow resize-none text-sm placeholder:text-sm"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="my-4" />
        <DialogFooter>
          {isFieldsDirty ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
              variant="destructive"
              disabled={isPending}
            >
              Reset form
            </Button>
          ) : (
            <div></div>
          )}
          <SubmitButton disabled={isPending} type="submit" className="w-28">
            Submit
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
