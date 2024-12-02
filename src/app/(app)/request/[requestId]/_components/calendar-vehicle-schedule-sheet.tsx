"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { TransportRequestWithRelations } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { CalendarIcon } from "lucide-react";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import TranpsortRequestCalendar from "@/app/(app)/department/[departmentId]/resources/transport/_components/transport-request-calendar";

interface CalendarVehicleScheduleSheetProps {
  vehicleId: string;
}

export default function CalendarVehicleScheduleSheet({
  vehicleId,
}: CalendarVehicleScheduleSheetProps) {
  const dialogManager = useDialogManager();
  const { data, isLoading } = useQuery<TransportRequestWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get(
        `/api/request/transport-request/get-vehicle-request/${vehicleId}`
      );
      return res.data.data;
    },
    queryKey: ["get-department-vehicle-schedules", vehicleId],
  });

  const formattedData = data?.map((request) => ({
    requestId: request.request.id,
    title: request.request.title,
    status: request.request.status,
    createdAt: request.request.createdAt,
    actualStart: request.actualStart,
    completedAt: request.request.completedAt,
    dateAndTimeNeeded: request.dateAndTimeNeeded,
  }));

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        disabled={isLoading}
        onClick={() => dialogManager.setActiveDialog("scheduleCalendar")}
      >
        {isLoading ? (
          <LoadingSpinner className="mr-1 size-4" />
        ) : (
          <CalendarIcon className="mr-1 size-4 text-muted-foreground" />
        )}
        Schedules
      </Button>
      <Sheet
        open={dialogManager.activeDialog === "scheduleCalendar"}
        onOpenChange={handleOpenChange}
      >
        <SheetContent className="!max-w-[50vw]">
          <SheetHeader>
            <SheetTitle>Schedules</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div>
            <TranpsortRequestCalendar data={formattedData} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
