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
import { createReturnableResourceRequest } from "@/lib/actions/resource";
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

const purpose = [
  {
    id: "Classroom Instruction",
    label: "Classroom Instruction",
  },
  {
    id: "Student Presentation",
    label: "Student Presentation",
  },
  {
    id: "Research Project",
    label: "Research Project",
  },
  {
    id: "School Event",
    label: "School Event",
  },
  {
    id: "Extracurricular Activity",
    label: "Extracurricular Activity",
  },
  {
    id: "Faculty Meeting",
    label: "Faculty Meeting",
  },
  {
    id: "other",
    label: "Other",
  },
] as const;

interface ReturnableResourceRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createReturnableResourceRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function ReturnableResourceRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: ReturnableResourceRequestInputProps) {
  const pathname = usePathname();
  const currentUser = useSession();
  const { department } = currentUser;
  const queryClient = useQueryClient();
  const itemId = form.watch("itemId");

  const {
    data: reservedDates,
    isLoading,
    refetch,
  } = useQuery<ReservedReturnableItemDateAndTime[]>({
    queryFn: async () => {
      if (!itemId) return [];
      const res = await axios.get(
        `/api/reserved-dates/resource-items/returnable/${itemId}`
      );
      return res.data.data;
    },
    queryKey: [itemId],
    enabled: !!itemId,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (itemId) {
      refetch();
    }
  }, [itemId, refetch]);

  const disabledTimeRanges = React.useMemo(() => {
    return (
      reservedDates?.map(({ dateAndTimeNeeded, returnDateAndTime }) => ({
        start: new Date(dateAndTimeNeeded),
        end: new Date(returnDateAndTime),
      })) ?? []
    );
  }, [reservedDates]);

  async function onSubmit(values: ReturnableResourceRequestSchema) {
    const { dateAndTimeNeeded, returnDateAndTime } = values;

    // Check for conflicts
    const hasConflict = disabledTimeRanges.some((range) =>
      isOverlapping(
        new Date(dateAndTimeNeeded),
        new Date(returnDateAndTime),
        range.start,
        range.end
      )
    );

    if (hasConflict) {
      toast.error(
        "The selected time range conflicts with existing reservations."
      );
      return;
    }

    const data: ExtendedReturnableResourceRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      department: department,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Submitting...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["pending-req-overview"] });
        queryClient.invalidateQueries({ queryKey: ["pending-req"] });
        queryClient.invalidateQueries({ queryKey: ["total-req-overview"] });
        handleOpenChange(false);
        return "Your request has been submitted and is awaiting approval.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Returnable Resource Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex w-full flex-col space-y-2">
              <ItemsField form={form} name="itemId" isPending={isPending} />
              <ResourceDateTimePicker
                form={form}
                name="dateAndTimeNeeded"
                label="Date and Time Needed"
                isLoading={isLoading}
                disabled={isPending || !itemId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={reservedDates}
              />
              <ResourceDateTimePicker
                form={form}
                name="returnDateAndTime"
                label="Return Date and Time"
                isLoading={isLoading}
                disabled={isPending || !itemId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={reservedDates}
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
