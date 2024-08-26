"use client";

import { createTransportRequest } from "@/lib/actions/requests";
import {
  ExtendedTransportRequestSchema,
  TransportRequestSchema,
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
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import {
  ReservedTransportDateAndTime,
  type ReservedDatesAndTimes,
} from "@/lib/schema/utils";
import DateTimePicker from "@/components/ui/date-time-picker";
import VehicleField from "./vehicle-field";

interface VenueRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createTransportRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<TransportRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function TransportRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: VenueRequestInputProps) {
  const pathname = usePathname();
  const currentUser = useSession();
  const { department } = currentUser;
  const queryClient = useQueryClient();
  const vehicleId = form.watch("vehicleId");

  const [open, setOpen] = React.useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery<
    ReservedTransportDateAndTime[]
  >({
    queryFn: async () => {
      if (!vehicleId) return [];
      const res = await axios.get(`/api/reserved-dates/transport/${vehicleId}`);
      return res.data.data;
    },
    queryKey: [vehicleId],
    enabled: !!vehicleId,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (vehicleId) {
      refetch();
    }
  }, [vehicleId, refetch]);

  const disabledDates = React.useMemo(() => {
    if (!data) return [];
    return data.map((item) => new Date(item.dateAndTimeNeeded));
  }, [data]);

  async function onSubmit(values: TransportRequestSchema) {
    const data: ExtendedTransportRequestSchema = {
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
        <DialogTitle>Venue Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex flex-1 flex-col space-y-2">
              <VehicleField
                form={form}
                name="vehicleId"
                isPending={isPending}
              />
              <DateTimePicker
                form={form}
                name="dateAndTimeNeeded"
                label="Date and Time needed"
                isLoading={isLoading}
                disabled={isPending || !vehicleId}
                disabledDates={disabledDates}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel className="text-left text-muted-foreground">
                      Destination
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Destination..."
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
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel className="text-left text-muted-foreground">
                      Purpose
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="Purpose..."
                        className="min-h-[200px] flex-grow resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* {vehicleId && (
              <div
                className={cn("scroll-bar max-h-[55vh] flex-1 overflow-y-auto")}
              >
                <P className="mb-2 font-semibold">
                  {venues.find((venue) => venue.value === venueName)?.label}{" "}
                  schedules
                </P>
                {isLoading || isRefetching ? (
                  <div className="grid h-32 w-full place-items-center">
                    <LoadingSpinner />
                  </div>
                ) : !data || data.length === 0 ? (
                  <div className="grid h-32 w-full place-items-center">
                    <P>No reserved schedules</P>
                  </div>
                ) : (
                  <>
                    {data.map((item, index) => (
                      <ScheduledEventCard key={index} data={item} />
                    ))}
                  </>
                )}
              </div>
            )} */}
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
