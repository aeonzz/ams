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
import type { VenueWithRelations } from "prisma/generated/zod";
import VenueRequestInputSkeleton from "./venue-request-input-skeleton";
import { VenueFeaturesType } from "@/lib/types/venue";
import ScheduledEventCardSkeleton from "./scheduled-event-card-skeleton";
import MultiSelect from "@/components/multi-select";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import { extensions } from "@/components/tiptap/editor";
import { ChevronLeft } from "lucide-react";
import { currentUser } from "@/lib/actions/users";
import DepartmentInput from "./department-input";

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
  const currentUser = useSession();
  const queryClient = useQueryClient();
  console.log(currentUser);
  const [isOpenRules, setIsOpenRules] = React.useState(false);
  const venueId = form.watch("venueId");

  const { data: venueData, isLoading: isLoadingVenueData } = useQuery<
    VenueWithRelations[]
  >({
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
    queryKey: ["venue-reserved-dates", venueId],
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
        ?.filter((item) => item.request.status === "APPROVED")
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

    if (startDate.getTime() < Date.now()) {
      toast.error("Start time cannot be in the past.");
      return;
    }

    if (endDate.getTime() < Date.now()) {
      toast.error("End time cannot be in the past.");
      return;
    }

    if (
      startDate.getTime() === endDate.getTime() &&
      startDate.toDateString() === endDate.toDateString()
    ) {
      toast.error(
        "Start time and end time cannot be the same on the same time."
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
        handleOpenChange(false);
        return "Your request has been submitted and is awaiting approval.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  const filteredVenueSetupRequirements =
    selectedVenue?.venueSetupRequirement.filter((v) => v.available);

  const editor = useEditor({
    extensions: extensions as Extension[],
    content: selectedVenue?.rulesAndRegulations,
    editable: false,
  });

  const departmentItems = currentUser.userDepartments.map((ud) => ({
    id: ud.department.id,
    name: ud.department.name,
  }));

  React.useEffect(() => {
    if (editor && selectedVenue?.rulesAndRegulations) {
      editor.commands.setContent(selectedVenue.rulesAndRegulations);
    }
  }, [editor, selectedVenue?.rulesAndRegulations]);

  if (isLoadingVenueData) return <VenueRequestInputSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex flex-1 scroll-m-10 scroll-p-10 flex-col space-y-2">
              <VenueField
                form={form}
                name="venueId"
                isPending={isPending}
                data={venueData}
              />
              <DepartmentInput
                form={form}
                name="department"
                label="Department"
                items={departmentItems}
                isPending={isPending}
                placeholder="Select a department"
                emptyMessage="No departments found"
              />
              <MultiSelect
                form={form}
                name="setupRequirements"
                label="Venue Setup Requirements"
                items={filteredVenueSetupRequirements}
                isPending={isPending}
                placeholder="Select items"
                emptyMessage="No items found."
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
                name="purpose"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="Purpose..."
                        className="min-h-[150px] flex-grow resize-none text-sm"
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
                        className="min-h-[120px] flex-grow resize-none text-sm"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {venueId && (
              <div className="flex-1">
                {isOpenRules && editor ? (
                  <div className="scroll-bar max-h-[60vh] space-y-3 overflow-y-auto">
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        className="size-7"
                        variant="ghost2"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpenRules(false);
                        }}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <H3 className="font-semibold">
                        Venue Rules and Regulation
                      </H3>
                    </div>
                    <div className="scroll-bar h-full overflow-y-auto">
                      <EditorContent className="outline-none" editor={editor} />
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn("scroll-bar max-h-[60vh] overflow-y-auto")}
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
                            (item) =>
                              item.request.venueRequest.venue.id === venueId
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
            )}
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            <div className="flex gap-2">
              {isFieldsDirty && (
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
              )}
              {selectedVenue?.rulesAndRegulations && (
                <span className="text-sm text-muted-foreground">
                  By proceeding, you confirm that you have read and accept the{" "}
                  <Button
                    variant="link"
                    className="h-fit p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenRules(true);
                    }}
                  >
                    rules and regulations
                  </Button>{" "}
                  of the venue.
                </span>
              )}
            </div>
            <SubmitButton disabled={isPending} type="submit" className="w-28">
              Submit
            </SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
