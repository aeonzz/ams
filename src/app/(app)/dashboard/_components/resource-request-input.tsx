"use client";

import { ExtendedResourceRequestSchema, type ResourceRequestSchema } from "@/lib/schema/resource";
import {
  type UseMutateAsyncFunction,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import {type  UseFormReturn } from "react-hook-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn, isDateInPast } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { type ReservedDatesAndTimes } from "@/lib/schema/utils";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import DateTimePicker from "@/components/ui/date-time-picker";
import { H3, P } from "@/components/typography/text";
import ScheduledEventCard from "./scheduled-event-card";
import VenueField from "./venue-field";
import { createResourceRequest } from "@/lib/actions/resource";
import ResourceField from "./items-field";

interface ResourceRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createResourceRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<ResourceRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function ResourceRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: ResourceRequestInputProps) {
  const pathname = usePathname();
  const currentUser = useSession();
  const { department } = currentUser;
  const queryClient = useQueryClient();


  // const { data, isLoading, refetch, isRefetching } = useQuery<
  //   ReservedDatesAndTimes[]
  // >({
  //   queryFn: async () => {
  //     if (!venueId) return [];
  //     const res = await axios.get(`/api/reserved-dates/venue/${venueId}`);
  //     return res.data.data;
  //   },
  //   queryKey: [venueId],
  //   enabled: !!venueId,
  //   refetchOnWindowFocus: false,
  // });

  // React.useEffect(() => {
  //   if (venueId) {
  //     refetch();
  //   }
  // }, [venueId, refetch]);

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

  async function onSubmit(values: ResourceRequestSchema) {
    const data: ExtendedResourceRequestSchema = {
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
        <DialogTitle>Resource Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex w-[307px] flex-col space-y-2">
              <ResourceField form={form} name="resourceItems" isPending={isPending} />
              {/* <DateTimePicker
                form={form}
                name="dateNeeded"
                label="Date needed"
                isLoading={isLoading}
                disabled={isPending || !venueId}
                disabledDates={disabledDates}
              />
              <DateTimePicker
                form={form}
                name="endTime"
                label="End Time"
                isLoading={isLoading}
                disabled={isPending || !venueId}
                disabledDates={disabledDates}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel className="text-left text-muted-foreground">
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="Notes..."
                        className="min-h-[200px] flex-grow resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <div className="flex flex-1 flex-col space-y-6">
              {/* <FormField
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
              <FormField
                control={form.control}
                name="setupRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Equipment needed
                    </FormLabel>
                    <div className="space-y-4">
                      {setup.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="setupRequirements"
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
              {form.watch("setupRequirements").includes("other") && (
                <FormField
                  control={form.control}
                  name="otherSetupRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Equipment</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Specify other equipment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}
            </div>
            {/* {venueId && (
              <div
                className={cn("scroll-bar max-h-[55vh] w-72 overflow-y-auto")}
              >
                <P className="mb-2 font-semibold">Schedules</P>
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
