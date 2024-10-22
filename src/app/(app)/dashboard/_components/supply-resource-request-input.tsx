"use client";

import { createVenueRequest } from "@/lib/actions/requests";
import {
  type ExtendedVenueRequestSchema,
  VenueRequestSchema,
} from "@/lib/schema/request";
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
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { type ReservedReturnableItemDateAndTime } from "@/lib/schema/utils";
import DateTimePicker from "@/components/ui/date-time-picker";
import {
  createReturnableResourceRequest,
  createSupplyResourceRequest,
} from "@/lib/actions/resource";
import type {
  ExtendedReturnableResourceRequestSchema,
  ReturnableResourceRequestSchema,
} from "@/lib/schema/resource/returnable-resource";
import ItemsField from "./items-field";
import { Textarea } from "@/components/ui/text-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ResourceDateTimePicker from "./resource-date-time-picker";
import { isOverlapping } from "@/lib/utils";
import {
  ExtendedSupplyResourceRequestSchema,
  type SupplyResourceRequestSchema,
} from "@/lib/schema/resource/supply-resource";
import SupplyItemsField from "./supply-items-field";
import type { SupplyItemWithRelations } from "prisma/generated/zod";
import { useSupplyItemCategory } from "@/lib/hooks/use-supply-item-category";
import SupplyResourceRequestSkeleton from "./supply-resource-request-skeleton";

const purpose = [
  {
    id: "Office Supplies",
    label: "Office Supplies",
  },
  {
    id: "Classroom Materials",
    label: "Classroom Materials",
  },
  {
    id: "Laboratory Equipment",
    label: "Laboratory Equipment",
  },
  {
    id: "Maintenance Tools",
    label: "Maintenance Tools",
  },
  {
    id: "Event Supplies",
    label: "Event Supplies",
  },
  {
    id: "Technology Equipment",
    label: "Technology Equipment",
  },
  {
    id: "other",
    label: "Other",
  },
] as const;

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

  const { data: items, isLoading: isItemsLoading } = useQuery<
    SupplyItemWithRelations[]
  >({
    queryKey: ["get-input-supply-resource"],
    queryFn: async () => {
      const response = await axios.get("/api/input-data/resource-items/supply");
      return response.data.data;
    },
  });

  const { data: categories, isLoading: isCategoriesLoading } =
    useSupplyItemCategory();

  const handleItemsChange = (
    newItems: { supplyItemId: string; quantity: number }[]
  ) => {
    form.setValue("items", newItems);
  };

  async function onSubmit(values: SupplyResourceRequestSchema) {
    const data: ExtendedSupplyResourceRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      departmentId: "test",
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

  const isLoading = isItemsLoading || isCategoriesLoading;

  if (isLoading) return <SupplyResourceRequestSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex w-full flex-col space-y-2">
              <SupplyItemsField
                onItemsChange={handleItemsChange}
                items={items}
                categories={categories}
                isPending={isPending}
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
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Purpose
                    </FormLabel>
                    <div className="space-y-4">
                      {purpose.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="purpose"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    disabled={isPending}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("purpose").includes("other") && (
                <FormField
                  control={form.control}
                  name="otherPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Purpose</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Specify other purpose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
    </>
  );
}
