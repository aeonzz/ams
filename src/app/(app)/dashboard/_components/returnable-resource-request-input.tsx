"use client";

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
import { InventoryItemWithRelations } from "prisma/generated/zod";
import ReturnableResourceRequestSkeleton from "./returnable-resource-request-input-skeleton";
import { socket } from "@/app/socket";
import DepartmentBorrowingPolicyCard from "./department-borrowing-policy-card";

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
  const queryClient = useQueryClient();
  const itemId = form.watch("itemId");
  const [selectedDepartmentId, setSelectedDepartmentId] =
    React.useState<string>();

  const { data, isLoading } = useQuery<InventoryItemWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items/returnable");
      return res.data.data;
    },
    queryKey: ["get-input-returnable-resource"],
  });

  const {
    data: reservedDates,
    isLoading: reservedDatesLoading,
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
  });

  React.useEffect(() => {
    if (itemId) {
      form.resetField("dateAndTimeNeeded");
      form.resetField("returnDateAndTime");
      refetch();
    }
  }, [itemId, refetch]);

  const disabledTimeRanges = React.useMemo(() => {
    return (
      reservedDates
        ?.filter((reservation) => reservation.request.status === "APPROVED")
        .map(({ dateAndTimeNeeded, returnDateAndTime }) => ({
          start: new Date(dateAndTimeNeeded),
          end: new Date(returnDateAndTime),
        })) ?? []
    );
  }, [reservedDates]);

  const handleDepartmentIdChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  };

  async function onSubmit(values: ReturnableResourceRequestSchema) {
    if (!selectedDepartmentId) return;
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
      departmentId: selectedDepartmentId,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Submitting...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-dashboard-overview"],
        });
        socket.emit("notifications");
        socket.emit("request_update");
        handleOpenChange(false);
        return "Your request has been submitted and is awaiting approval.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  if (isLoading) return <ReturnableResourceRequestSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex flex-1 scroll-m-10 scroll-p-10 flex-col space-y-2">
              <ItemsField
                form={form}
                name="itemId"
                data={data}
                isPending={isPending}
                onDepartmentIdChange={handleDepartmentIdChange}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Comlab"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ResourceDateTimePicker
                form={form}
                name="dateAndTimeNeeded"
                label="Date and Time Needed"
                isLoading={reservedDatesLoading}
                disabled={isPending || !itemId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={reservedDates}
              />
              <ResourceDateTimePicker
                form={form}
                name="returnDateAndTime"
                label="Return Date and Time"
                isLoading={reservedDatesLoading}
                disabled={isPending || !itemId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={reservedDates}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
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
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="Other info..."
                        className="min-h-[120px] flex-grow resize-none text-sm placeholder:text-sm"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {itemId && selectedDepartmentId && (
              <div className="flex-1">
                <DepartmentBorrowingPolicyCard
                  data={
                    data?.find(
                      (item) => item.departmentId === selectedDepartmentId
                    )?.department
                  }
                />
              </div>
            )}
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
