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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { cn, isOverlapping } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { H3, P } from "@/components/typography/text";
import ScheduledEventCard from "./scheduled-event-card";
import VenueField from "./venue-field";
import VenueDateTimePicker from "./venue-date-time-picker";
import type { VenueWithRelations } from "prisma/generated/zod";
import ScheduledEventCardSkeleton from "./scheduled-event-card-skeleton";
import MultiSelect from "@/components/multi-select";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import { extensions } from "@/components/tiptap/editor";
import { ChevronLeft } from "lucide-react";
import DepartmentInput from "./department-input";
import { AnimatePresence, motion } from "framer-motion";
import { outExpo } from "@/lib/easings";
import { useVenueReservedDates } from "@/lib/hooks/use-venue-reservation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "usehooks-ts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [isOpenRules, setIsOpenRules] = React.useState(false);
  const venueId = form.watch("venueId");
  const selectedDepartment = form.watch("department");

  const { data: venueData, isLoading: isLoadingVenueData } = useQuery<
    VenueWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/venue");
      return res.data.data;
    },
    queryKey: ["get-input-venue"],
  });

  const { disabledTimeRanges, data, isLoading, refetch, isRefetching } =
    useVenueReservedDates({
      venueId,
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

  async function onSubmit(values: VenueRequestSchema) {
    try {
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
        form.setError("endTime", {
          type: "manual",
          message:
            "Start time and end time cannot be the same on the same time.",
        });
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
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
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

  const scheduleSection = (
    <div className="flex-1">
      <div className={cn("scroll-bar max-h-[60vh] overflow-y-auto")}>
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
    </div>
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {selectedDepartment ? (
              <motion.div
                key="form-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1, ease: outExpo }}
              >
                {isOpenRules && editor ? (
                  <ScrollArea className="h-[60vh] space-y-3 px-4">
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
                      <H3 className="font-semibold text-yellow">
                        Venue Rules and Regulation
                      </H3>
                    </div>
                    <div className="scroll-bar h-full overflow-y-auto">
                      <EditorContent className="outline-none" editor={editor} />
                    </div>
                  </ScrollArea>
                ) : (
                  <div
                    className={cn(
                      "scroll-bar max-h-[60vh] overflow-y-auto px-4 py-1",
                      isDesktop ? "flex gap-6" : "flex flex-col"
                    )}
                  >
                    <div className="flex flex-1 scroll-m-10 scroll-p-10 flex-col space-y-2">
                      {!isDesktop && venueId && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="schedules">
                            <AccordionTrigger className="py-0">
                              View Schedules
                            </AccordionTrigger>
                            <AccordionContent>
                              {scheduleSection}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                      <VenueField
                        form={form}
                        name="venueId"
                        isPending={isPending}
                        data={venueData}
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

                    {/* Schedule Section - Only shown in desktop */}
                    {isDesktop && venueId && scheduleSection}
                  </div>
                )}
                <Separator className="my-4" />
                <DialogFooter>
                  <div className="flex gap-2">
                    {isFieldsDirty && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();

                          form.reset();
                        }}
                        variant="secondary"
                        disabled={isPending}
                      >
                        Back
                      </Button>
                    )}
                    {selectedVenue?.rulesAndRegulations && (
                      <span className="text-sm text-muted-foreground">
                        By proceeding, you confirm that you have read and accept
                        the{" "}
                        <Button
                          variant="link"
                          className="h-fit p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpenRules(false);
                            setIsOpenRules(true);
                          }}
                        >
                          rules and regulations
                        </Button>{" "}
                        of the venue.
                      </span>
                    )}
                  </div>
                  <SubmitButton
                    disabled={isPending}
                    type="submit"
                    className="w-28"
                  >
                    Submit
                  </SubmitButton>
                </DialogFooter>
              </motion.div>
            ) : (
              <motion.div
                key="department-select"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1, ease: outExpo }}
                className="flex h-[350px] w-full items-center justify-center"
              >
                <DepartmentInput
                  form={form}
                  name="department"
                  label="Requesting as?"
                  items={departmentItems}
                  isLoading={isLoadingVenueData}
                  isPending={isPending}
                  placeholder="Select a department"
                  emptyMessage="No departments found"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </>
  );
}
