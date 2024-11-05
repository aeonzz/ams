"use client";

import DateTimePicker from "@/components/ui/date-time-picker";
import { type UpdateTransportRequestSchema } from "@/lib/schema/request";
import { type ReservedTransportDateAndTime } from "@/lib/schema/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

interface TransportEditTimeInputProps {
  form: UseFormReturn<UpdateTransportRequestSchema>;
  vehicleId: string;
  isPending: boolean;
}

export default function TransportEditTimeInput({
  form,
  vehicleId,
  isPending,
}: TransportEditTimeInputProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery<
    ReservedTransportDateAndTime[]
  >({
    queryFn: async () => {
      const res = await axios.get(`/api/reserved-dates/transport/${vehicleId}`);
      return res.data.data;
    },
    queryKey: [vehicleId],
  });

  const disabledDates = React.useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.request.status === "APPROVED")
      .map((item) => new Date(item.dateAndTimeNeeded));
  }, [data]);

  return (
    <DateTimePicker
      form={form}
      name="dateAndTimeNeeded"
      isLoading={isLoading}
      disabled={isPending || !vehicleId}
      disabledDates={disabledDates}
    />
  );
}
