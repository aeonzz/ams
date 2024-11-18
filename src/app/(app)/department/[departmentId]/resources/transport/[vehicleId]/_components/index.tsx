"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type VehicleWithRelations } from "prisma/generated/zod";
import {
  Dot,
  ChevronLeft,
  CirclePlus,
  CircleMinus,
  RotateCw,
} from "lucide-react";
import { H1, H4, H5, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn, getVehicleStatusColor, textTransform } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { UpdateVehicleSheet } from "@/app/(admin)/admin/vehicles/_components/update-vehicle-sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { PermissionGuard } from "@/components/permission-guard";
import ManageVehicleSkeleton from "./manage-vehicle-skeleton";
import VehicleRequestsTable from "./vehicle-requests-table";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { PhotoProvider, PhotoView } from "react-photo-view";
import NumberFlow from "@number-flow/react";
import { AlertCard } from "@/components/ui/alert-card";
import { useHotkeys } from "react-hotkeys-hook";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import MaintenanceDialog from "./maintenance-dialog";

interface ManageVehicleScreenProps {
  params: {
    departmentId: string;
    vehicleId: string;
  };
}

export default function ManageVehicleScreen({
  params,
}: ManageVehicleScreenProps) {
  const currentUser = useSession();
  const dialogManager = useDialogManager();

  const router = useRouter();
  const { departmentId, vehicleId } = params;
  const { data, isLoading, refetch, isError, error } =
    useQuery<VehicleWithRelations>({
      queryFn: async () => {
        const res = await axios.get(`/api/vehicle/get-vehicle/${vehicleId}`);
        return res.data.data;
      },
      queryKey: ["vehicle-details", vehicleId],
    });

  const isUpdateSheetOpen =
    dialogManager.activeDialog === "adminUpdateVehicleSheet";

  useHotkeys(
    "e",
    (event) => {
      if (!dialogManager.isAnyDialogOpen()) {
        event.preventDefault();
        dialogManager.setActiveDialog("adminUpdateVehicleSheet");
      }
    },
    { enableOnFormTags: false, enabled: !data?.requiresMaintenance }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  if (isLoading) return <ManageVehicleSkeleton />;
  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }
  if (isError)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  if (!data) return <NotFound />;

  const status = getVehicleStatusColor(data.status);

  const formattedRequests = data.transportRequest.map((request) => {
    return {
      id: request.requestId,
      requestsTitle: request.request.title,
      requestsStatus: request.request.status,
      createdAt: request.request.createdAt,
    };
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost2" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="size-4" />
          </Button>
          <H5 className="truncate font-semibold">{data.name}</H5>
        </div>
        <SearchInput />
      </div>
      <div className="scroll-bar container h-full overflow-y-auto p-0">
        {data.requiresMaintenance && (
          <div>
            <div className="px-6 py-3">
              <AlertCard
                variant="warning"
                title="Vehicle Requires Maintenance"
                description="This vehicle has reached its maintenance threshold and requires immediate attention."
                className="w-full"
              />
            </div>
            <Separator />
          </div>
        )}
        <div className="flex h-full">
          <div className="flex flex-col gap-3 p-6 pr-0">
            <PhotoProvider
              speed={() => 300}
              maskOpacity={0.8}
              loadingElement={<LoadingSpinner />}
              toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                return (
                  <>
                    <div className="flex gap-3">
                      <CirclePlus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale + 1)}
                      />
                      <CircleMinus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale - 1)}
                      />
                      <RotateCw
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onRotate(rotate + 90)}
                      />
                    </div>
                  </>
                );
              }}
            >
              <div>
                <PhotoView key={data.imageUrl} src={data.imageUrl}>
                  <div className="relative aspect-video h-60 w-[380px] cursor-pointer transition-all hover:brightness-75">
                    <Image
                      src={data.imageUrl}
                      alt={`Image of ${data.name}`}
                      fill
                      priority
                      className="rounded-md border object-cover"
                    />
                  </div>
                </PhotoView>
              </div>
            </PhotoProvider>
            <div className="flex h-full flex-col gap-3">
              <div className="space-y-3">
                <div className="space-y-1">
                  <H1 className="w-[380px] text-3xl font-bold">{data.name}</H1>
                  <Badge variant={status.variant} className="pr-3.5">
                    <Dot
                      className="mr-1 size-3"
                      strokeWidth={status.stroke}
                      color={status.color}
                    />
                    {textTransform(data.status)}
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <UpdateVehicleSheet
                    open={isUpdateSheetOpen}
                    onOpenChange={handleOpenChange}
                    queryKey={["vehicle-details", vehicleId]}
                    removeField
                    vehicle={data}
                  />
                  <PermissionGuard
                    allowedRoles={["DEPARTMENT_HEAD"]}
                    allowedDepartment={departmentId}
                    currentUser={currentUser}
                  >
                    {data.requiresMaintenance ? (
                      <MaintenanceDialog
                        vehicleId={data.id}
                        initialOdometer={data.odometer}
                      />
                    ) : (
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() =>
                          dialogManager.setActiveDialog(
                            "adminUpdateVehicleSheet"
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}
                  </PermissionGuard>
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">Type</P>
                  <P>{data.type}</P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">
                    Capacity
                  </P>
                  <P>
                    <NumberFlow
                      willChange
                      continuous
                      value={data.capacity}
                      format={{ useGrouping: false }}
                      aria-hidden
                    />
                  </P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">
                    Odometer
                  </P>
                  <P>
                    <NumberFlow
                      willChange
                      continuous
                      value={data.odometer}
                      format={{ useGrouping: false }}
                      aria-hidden
                    />
                  </P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">
                    Odometer Maintenance Interval
                  </P>
                  <P>
                    <NumberFlow
                      willChange
                      continuous
                      value={data.maintenanceInterval}
                      format={{ useGrouping: false }}
                      aria-hidden
                    />
                  </P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">
                    Lincense Plate
                  </P>
                  <P>{data.licensePlate}</P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">Created</P>
                  <P>{format(data.createdAt, "Pp")}</P>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <P className="font-semibold text-muted-foreground">
                    Last Update
                  </P>
                  <P>{format(data.updatedAt, "Pp")}</P>
                </div>
                <Separator className="my-2" />
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="mx-6 h-full" />
          <div className="flex-1">
            <VehicleRequestsTable requests={formattedRequests} />
          </div>
        </div>
      </div>
    </div>
  );
}
