"use client";

import NotFound from "@/app/not-found";
import FetchDataError from "@/components/card/fetch-data-error";
import { H4, P } from "@/components/typography/text";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarX, Dot, ExternalLink, PlusIcon, Search } from "lucide-react";
import type { VehicleWithRelations } from "prisma/generated/zod";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchInput from "@/app/(app)/_components/search-input";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn, getVehicleStatusColor, textTransform } from "@/lib/utils";
import VehicleLoadingSkeleton from "./department-vehicle-screen-skeleton";

interface DepartmentVehicleScreen {
  departmentId: string;
}

const NoDataMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-2 p-8 text-center">
    <CalendarX className="size-16" strokeWidth={1} />
    <P className="text-muted-foreground">{message}</P>
  </div>
);

export default function DepartmentVehicleScreen({
  departmentId,
}: DepartmentVehicleScreen) {
  const dialogManager = useDialogManager();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data, isLoading, refetch, isError, error } = useQuery<
    VehicleWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(
        `/api/vehicle/get-department-vehicles/${departmentId}`
      );
      return res.data.data;
    },
    queryKey: ["department-vehicles", departmentId],
  });

  const filteredVehicles =
    data?.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }

  return (
    <>
      <div className="flex w-full justify-between p-3 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search vehicles..."
            className="h-9 w-[280px] bg-tertiary pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="default"
          onClick={() =>
            dialogManager.setActiveDialog("adminCreateVehicleDialog")
          }
        >
          <PlusIcon className="mr-1 size-4" aria-hidden="true" />
          <P className="font-semibold">Add</P>
        </Button>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        {isLoading ? (
          <VehicleLoadingSkeleton />
        ) : isError ? (
          <div className="flex h-screen w-full items-center justify-center">
            <FetchDataError refetch={refetch} />
          </div>
        ) : data?.length === 0 ? (
          <NoDataMessage message="No vehicles available." />
        ) : (
          <div className="w-[1280px]">
            {filteredVehicles.length === 0 ? (
              <NoDataMessage message="No vehicles found. Try adjusting your search" />
            ) : (
              <div className="grid grid-cols-1 gap-3 pb-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle) => {
                  const status = getVehicleStatusColor(vehicle.status);
                  return (
                    <Link
                      key={vehicle.id}
                      href={`/department/${departmentId}/transport/${vehicle.id}`}
                    >
                      <Card className="relative cursor-pointer overflow-hidden shadow-md transition-all hover:border-primary">
                        <div className="relative aspect-video h-48 w-full">
                          <Image
                            src={vehicle.imageUrl}
                            alt={`Image of ${vehicle.name}`}
                            fill
                            priority
                            className="object-cover"
                          />
                        </div>
                        <CardHeader className="p-3">
                          <CardTitle className="flex max-w-64 items-center justify-between">
                            <H4 className="truncate">{vehicle.name}</H4>
                          </CardTitle>
                          <div className="flex items-center justify-between">
                            <Badge variant={status.variant} className="pr-3.5">
                              <Dot
                                className="mr-1 size-3"
                                strokeWidth={status.stroke}
                                color={status.color}
                              />
                              {textTransform(vehicle.status)}
                            </Badge>
                            <Link
                              href={`/department/${departmentId}/transport/${vehicle.id}`}
                              className={cn(
                                buttonVariants({
                                  variant: "ghost2",
                                  size: "icon",
                                })
                              )}
                              prefetch
                            >
                              <ExternalLink className="size-5" />
                            </Link>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
