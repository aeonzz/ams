"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CalendarIcon,
  ClipboardIcon,
  MapPinIcon,
  Pencil,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import type { DepartmentWithRelations } from "prisma/generated/zod";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { H1, H4, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UpdateDepartmentSheet } from "@/app/(admin)/admin/departments/_components/update-department-sheet";
import { useHotkeys } from "react-hotkeys-hook";
import Link from "next/link";
import OverviewNavigationMenu from "../../_components/navigation-menu";

interface AboutDepartmentScreenProps {
  departmentId: string;
}

export default function AboutDepartmentScreen({
  departmentId,
}: AboutDepartmentScreenProps) {
  const [showUpdateDepartment, setShowUpdateDepartment] = React.useState(false);
  const { data, isLoading, refetch, isError } =
    useQuery<DepartmentWithRelations>({
      queryFn: async () => {
        const res = await axios.get(
          `/api/department/get-department-by-id/${departmentId}`
        );
        return res.data.data;
      },
      queryKey: [departmentId],
    });

  useHotkeys(
    "e",
    (event) => {
      event.preventDefault();
      setShowUpdateDepartment(true);
    },
    { enableOnFormTags: false }
  );

  if (isLoading) {
    return <DepartmentSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">{data.name}</P>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu data={data} />
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        <div className="container w-full p-0">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <H1 className="font-semibold tracking-tight">{data.name}</H1>
                <UpdateDepartmentSheet
                  open={showUpdateDepartment}
                  onOpenChange={setShowUpdateDepartment}
                  queryKey={[departmentId]}
                  department={data}
                />
                <Button
                  variant="ghost2"
                  size="icon"
                  onClick={() => setShowUpdateDepartment(true)}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
              <div className="flex space-x-1">
                <Badge variant={data.acceptsJobs ? "default" : "red"}>
                  Jobs
                </Badge>
                <Badge variant={data.acceptsJobs ? "default" : "red"}>
                  Transport
                </Badge>
              </div>
              <P className="break-all text-muted-foreground">
                {data.description}
              </P>
            </div>
            <div className="rounded-md border p-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Duties:
              </p>
              <P>{data.responsibilities}</P>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentSkeleton() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6 flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border">
          <CardHeader>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
