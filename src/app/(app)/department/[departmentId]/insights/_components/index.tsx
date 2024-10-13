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
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import RequestStatusOverview from "./request-status--overview";
import JobRequestChart from "./job-request-chart";

interface DepartmentInsightsScreenProps {
  departmentId: string;
}

export default function DepartmentInsightsScreen({
  departmentId,
}: DepartmentInsightsScreenProps) {
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  if (isLoading) {
    return <p>...loading</p>;
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
        <P className="font-medium">Department Insights</P>
        <div className="flex items-center gap-2">
          <OverviewNavigationMenu data={data} />
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        <div className="grid grid-flow-row grid-cols-3 gap-3">
          <RequestStatusOverview data={data} className="h-[400px]" />
          {data.acceptsJobs && (
            <JobRequestChart data={data} className="col-span-2 h-[400px]" />
          )}
        </div>
      </div>
    </div>
  );
}
