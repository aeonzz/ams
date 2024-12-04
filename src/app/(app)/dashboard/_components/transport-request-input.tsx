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
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { ReservedTransportDateAndTime } from "@/lib/schema/utils";
import DateTimePicker from "@/components/ui/date-time-picker";
import VehicleField from "./vehicle-field";
import { P } from "@/components/typography/text";
import { Vehicle } from "prisma/generated/zod";
import { TagInput } from "@/components/ui/tag-input";
import { Info } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ScheduledEventCardSkeleton from "./scheduled-event-card-skeleton";
import VehicleScheduleCard from "./vehicle-schedule-card";
import { Switch } from "@/components/ui/switch";
import DepartmentInput from "./department-input";
import { useSession } from "@/lib/hooks/use-session";
import { AnimatePresence, motion } from "framer-motion";
import { outExpo } from "@/lib/easings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const queryClient = useQueryClient();
  const vehicleId = form.watch("vehicleId");
  const selectedDepartment = form.watch("department");
  console.log(selectedDepartment);

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

  const { data: vehicleData, isLoading: isLoadingVehicleData } = useQuery<
    Vehicle[]
  >({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/vehicles");
      return res.data.data;
    },
    queryKey: ["get-input-vehicles"],
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (vehicleId) {
      refetch();
    }
  }, [vehicleId, refetch]);

  const disabledDates = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.request.status === "APPROVED")
      .map((item) => new Date(item.dateAndTimeNeeded));
  }, [data]);

  async function onSubmit(values: TransportRequestSchema) {
    const now = new Date();
    const minDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const { dateAndTimeNeeded, isUrgent } = values;

    if (dateAndTimeNeeded.getTime() < Date.now()) {
      toast.error("Date and time needed cannot be in the past.");
      return;
    }

    if (!isUrgent && dateAndTimeNeeded < minDate) {
      toast.error(
        "Request should be submitted not later than 2 days prior to the requested date."
      );
      return;
    }

    if (
      dateAndTimeNeeded.getHours() === 0 &&
      dateAndTimeNeeded.getMinutes() === 0
    ) {
      toast.error("Time cannot be exactly midnight (00:00).");
      return;
    }

    const selectedVehicle = vehicleData?.find(
      (vehicle) => vehicle.id === values.vehicleId
    );

    if (!selectedVehicle) {
      toast.error("Selected vehicle not found.");
      return;
    }

    const data: ExtendedTransportRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      departmentId: selectedVehicle.departmentId,
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

  const departmentItems = currentUser.userDepartments.map((ud) => ({
    id: ud.department.id,
    name: ud.department.name,
  }));

  const scheduleSection = (
    <div className={cn("scroll-bar max-h-[60vh] overflow-y-auto")}>
      <P className="mb-2 font-semibold">Schedules</P>
      {isLoading || isRefetching ? (
        <ScheduledEventCardSkeleton />
      ) : !data || data.length === 0 ? (
        <div className="grid h-32 w-full place-items-center">
          <P>No schedules</P>
        </div>
      ) : (
        <>
          {(() => {
            const filteredData = data.filter(
              (item) => item.request.transportRequest.vehicle.id === vehicleId
            );
            return filteredData.length === 0 ? (
              <div className="grid h-32 w-full place-items-center">
                <P>No reserved schedules</P>
              </div>
            ) : (
              filteredData.map((item, index) => (
                <VehicleScheduleCard key={index} data={item} />
              ))
            );
          })()}
        </>
      )}
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
                <div
                  className={cn(
                    "scroll-bar max-h-[60vh] overflow-y-auto px-4 py-1",
                    isDesktop ? "flex gap-6" : "flex flex-col"
                  )}
                >
                  <div className="flex flex-1 scroll-m-10 scroll-p-10 flex-col space-y-2">
                    <div className="flex">
                      <div className="mr-2 w-fit pt-[2px]">
                        <Info className="size-4 text-primary" />
                      </div>
                      <P className="text-muted-foreground">
                        Request should be submitted not later than 2 days prior
                        to the requested date.
                      </P>
                    </div>
                    {!isDesktop && vehicleId && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="schedules">
                          <AccordionTrigger className="py-0">
                            View Schedules
                          </AccordionTrigger>
                          <AccordionContent>{scheduleSection}</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                    <VehicleField
                      form={form}
                      name="vehicleId"
                      isPending={isPending}
                      data={vehicleData}
                    />
                    <DateTimePicker
                      form={form}
                      name="dateAndTimeNeeded"
                      label="Date and Time needed"
                      isLoading={isLoading}
                      disabled={isPending || !vehicleId}
                      disabledDates={disabledDates}
                    >
                      <Popover modal>
                        <PopoverTrigger className="text-primary hover:underline">
                          Urgent request
                        </PopoverTrigger>
                        <PopoverContent className="w-[360px] p-0">
                          <FormField
                            control={form.control}
                            name="isUrgent"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Mark as Urgent
                                  </FormLabel>
                                  <FormDescription>
                                    Enable this option to prioritize the request
                                    as urgent.
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
                        </PopoverContent>
                      </Popover>
                    </DateTimePicker>
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem className="flex flex-grow flex-col">
                          <FormLabel className="text-left">
                            Destination
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Destination..."
                              autoComplete="off"
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
                      name="passengersName"
                      render={({ field }) => {
                        const selectedVehicle = vehicleData?.find(
                          (vehicle) => vehicle.id === vehicleId
                        );
                        const maxCapacity = selectedVehicle?.capacity ?? 0;

                        return (
                          <FormItem className="flex flex-grow flex-col">
                            <FormLabel className="text-left">
                              Passenger(s) Name
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                placeholder={`Enter passenger name (max: ${maxCapacity})`}
                                disabled={isPending || maxCapacity === 0}
                                value={field.value || []}
                                onChange={(value) => {
                                  if (value.length <= maxCapacity) {
                                    field.onChange(value);
                                  } else {
                                    toast.error(
                                      `Maximum capacity of ${maxCapacity} passengers reached.`
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-grow flex-col">
                          <FormLabel className="text-left">Purpose</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={1}
                              maxRows={5}
                              placeholder="Purpose..."
                              className="min-h-[200px] flex-grow resize-none bg-transparent text-sm shadow-none"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    {isDesktop && vehicleId && scheduleSection}
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
                      variant="secondary"
                      disabled={isPending}
                    >
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
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
                  label="Requesting as"
                  items={departmentItems}
                  isPending={isPending}
                  isLoading={isLoading}
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
