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
import { ReservedTransportDateAndTime } from "@/lib/schema/utils";
import DateTimePicker from "@/components/ui/date-time-picker";
import VehicleField from "./vehicle-field";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { P } from "@/components/typography/text";
import { cn } from "@/lib/utils";
import VehicleScheduleCard from "./vehicle-schedule-card";
import { Vehicle } from "prisma/generated/zod";
import TransportRequestInputSkeleton from "./transport-request-input-skeleton";
import ScheduledEventCardSkeleton from "./scheduled-event-card-skeleton";
import { TagInput } from "@/components/ui/tag-input";
import { Info } from "lucide-react";

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
  const queryClient = useQueryClient();
  const vehicleId = form.watch("vehicleId");

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

  if (isLoadingVehicleData) return <TransportRequestInputSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2 px-4">
            <div className="scroll-bar flex max-h-[60vh] flex-1 overflow-y-auto px-1 py-1">
              <div className="flex flex-col space-y-2">
                <div className="flex">
                  <div className="mr-2 w-fit pt-[2px]">
                    <Info className="size-4 text-primary" />
                  </div>
                  <P className="text-muted-foreground">
                    Request should be submitted not later than 2 days prior to
                    the requested date.
                  </P>
                </div>
                <div className="flex gap-2">
                  <VehicleField
                    form={form}
                    name="vehicleId"
                    isPending={isPending}
                    data={vehicleData}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel className="text-left">
                          Office/Dept.
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="Offic/Dept...."
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                      <FormLabel className="text-left">Destination</FormLabel>
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
                          className="min-h-[200px] flex-grow resize-none bg-transparent shadow-none placeholder:text-sm"
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
            {vehicleId && (
              <div
                className={cn(
                  "scroll-bar max-h-[60vh] w-[300px] overflow-y-auto pr-1"
                )}
              >
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
                        (item) =>
                          item.request.transportRequest.vehicle.id === vehicleId
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
