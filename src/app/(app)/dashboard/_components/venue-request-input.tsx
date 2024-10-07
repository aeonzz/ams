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
import { Textarea } from "@/components/ui/text-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn, isOverlapping } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { type ReservedDatesAndTimes } from "@/lib/schema/utils";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, P } from "@/components/typography/text";
import ScheduledEventCard from "./scheduled-event-card";
import VenueField from "./venue-field";
import VenueDateTimePicker from "./venue-date-time-picker";
import { type Venue } from "prisma/generated/zod";
import VenueRequestInputSkeleton from "./venue-request-input-skeleton";
import { VenueFeaturesType } from "@/lib/types/venue";
import ScheduledEventCardSkeleton from "./scheduled-event-card-skeleton";

const purpose = [
  {
    id: "Lecture/Forum/Symposium",
    label: "Lecture/Forum/Symposium",
  },
  {
    id: "Film Showing",
    label: "Film Showing",
  },
  {
    id: "Seminar/Workshop",
    label: "Seminar/Workshop",
  },
  {
    id: "Video Coverage",
    label: "Video Coverage",
  },
  {
    id: "College Meeting/Conference",
    label: "College Meeting/Conference",
  },
  {
    id: "other",
    label: "Others",
  },
] as const;

interface VenueRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createVenueRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<VenueRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function VenueRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: VenueRequestInputProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const venueId = form.watch("venueId");

  const { data: venueData, isLoading: isLoadingVenueData } = useQuery<Venue[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/venue");
      return res.data.data;
    },
    queryKey: ["get-input-venue"],
  });

  const { data, isLoading, refetch, isRefetching } = useQuery<
    ReservedDatesAndTimes[]
  >({
    queryFn: async () => {
      if (!venueId) return [];
      const res = await axios.get(`/api/reserved-dates/venue/${venueId}`);
      return res.data.data;
    },
    queryKey: [venueId],
    enabled: !!venueId,
    refetchOnWindowFocus: false,
  });

  const selectedVenue = React.useMemo(() => {
    return venueData?.find((venue) => venue.id === venueId);
  }, [venueData, venueId]);

  React.useEffect(() => {
    if (venueId) {
      refetch();
    }
  }, [venueId, refetch]);

  // const disabledDates = React.useMemo(() => {
  //   if (!data) return [];

  //   return data.flatMap((item) => {
  //     const startDate = new Date(item.startTime);
  //     const endDate = new Date(item.endTime);
  //     const dates = [];

  //     for (
  //       let date = startDate;
  //       date <= endDate;
  //       date.setDate(date.getDate() + 1)
  //     ) {
  //       dates.push(new Date(date));
  //     }

  //     return dates;
  //   });
  // }, [data]);

  const disabledTimeRanges = React.useMemo(() => {
    return (
      data
        ?.filter(
          (item) =>
            item.request.status === "APPROVED" ||
            item.request.status === "REVIEWED"
        )
        .map(({ startTime, endTime }) => ({
          start: new Date(startTime),
          end: new Date(endTime),
        })) ?? []
    );
  }, [data]);

  async function onSubmit(values: VenueRequestSchema) {
    const { startTime, endTime } = values;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (
      startDate.getTime() === endDate.getTime() &&
      startDate.toDateString() === endDate.toDateString()
    ) {
      toast.error(
        "Start time and end time cannot be the same on the same day."
      );
      return;
    }

    // Check for conflicts
    const hasConflict = disabledTimeRanges.some((range) =>
      isOverlapping(
        new Date(startTime),
        new Date(endTime),
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

    const selectedVenue = venueData?.find(
      (venue) => venue.id === values.venueId
    );

    if (!selectedVenue) {
      toast.error("Selected venue not found.");
      return;
    }

    const data: ExtendedVenueRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      departmentId: selectedVenue.departmentId,
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

  if (isLoadingVenueData) return <VenueRequestInputSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex w-[307px] flex-col space-y-2">
              <VenueField
                form={form}
                name="venueId"
                isPending={isPending}
                data={venueData}
              />
              <VenueDateTimePicker
                form={form}
                name="startTime"
                label="Start Time"
                isLoading={isLoading}
                disabled={isPending || !venueId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={data}
              />
              <VenueDateTimePicker
                form={form}
                name="endTime"
                label="End Time"
                isLoading={isLoading}
                disabled={isPending || !venueId}
                disabledTimeRanges={disabledTimeRanges}
                reservations={data}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel className="text-left">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="Description..."
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
            <div className="flex flex-1 flex-col space-y-6 overflow-hidden">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
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
                                <FormLabel className="truncate font-normal">
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
              <FormField
                control={form.control}
                name="setupRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Features</FormLabel>
                    <div className="space-y-4">
                      {selectedVenue?.features &&
                        (selectedVenue.features as VenueFeaturesType[]).map(
                          (feature) => (
                            <FormItem
                              key={feature.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  disabled={isPending}
                                  checked={field.value?.includes(feature.name)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), feature.name]
                                      : (field.value || []).filter(
                                          (value) => value !== feature.name
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="truncate break-all font-normal">
                                {feature.name}
                              </FormLabel>
                            </FormItem>
                          )
                        )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {venueId && (
              <div
                className={cn("scroll-bar max-h-[60vh] flex-1 overflow-y-auto")}
              >
                <P className="mb-2 font-semibold">Schedules</P>
                {isLoading || isRefetching ? (
                  <ScheduledEventCardSkeleton />
                ) : !data || data.length === 0 ? (
                  <div className="grid h-32 w-full place-items-center">
                    <P>No reserved schedules</P>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const filteredData = data.filter(
                        (item) => item.request.venueRequest.venue.id === venueId
                      );
                      return filteredData.length === 0 ? (
                        <div className="grid h-32 w-full place-items-center">
                          <P>No reserved schedules</P>
                        </div>
                      ) : (
                        filteredData.map((item, index) => (
                          <ScheduledEventCard key={index} data={item} />
                        ))
                      );
                    })()}
                  </>
                )}
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
