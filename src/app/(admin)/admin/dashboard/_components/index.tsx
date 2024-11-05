"use client";

import React, { useState } from "react";

import { useSession } from "@/lib/hooks/use-session";
import { H1, H2, H3, P } from "@/components/typography/text";
import AdminSearchInput from "../../_components/admin-search-input";
import RequestTypeSchema, {
  RequestTypeType,
} from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import type { SystemOverViewData } from "./types";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import DepartmentInsightsSkeleton from "../../departments/[departmentId]/insights/_components/department-insights-skeleton";
import FetchDataError from "@/components/card/fetch-data-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, Dot, X } from "lucide-react";
import { cn, formatFullName, getStatusColor, textTransform } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import SystemKPICards from "./system-kpi-cards";
import RequestChart from "./requests-chart";
import OverviewSkeleton from "./overview-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import RequestsTable from "./requests-table";

export default function AdminDashboardScreen() {
  const [requestType, setRequestType] = React.useState<RequestTypeType | "">(
    ""
  );
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { data, isLoading, isError, refetch } = useQuery<SystemOverViewData>({
    queryKey: ["system-overview"],
    queryFn: async () => {
      const res = await axios.get(`/api/overview/admin-dashboard-overview`);
      return res.data.data;
    },
  });

  const filteredData = React.useMemo(() => {
    if (!data) return { requests: [], users: [] };

    let filteredRequests = data.requests;

    if (date?.from && date?.to) {
      filteredRequests = filteredRequests.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }

    if (requestType) {
      filteredRequests = filteredRequests.filter((r) => r.type === requestType);
    }

    let filteredUsers = data.users;
    if (date?.from && date?.to) {
      filteredUsers = filteredUsers.filter((u) => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= date.from! && createdAt <= date.to!;
      });
    }

    return {
      requests: filteredRequests,
      users: filteredUsers,
    };
  }, [data, date, requestType]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">Overview</P>
        <div className="flex gap-2">
          {(date?.from !== undefined || requestType !== "") && (
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => {
                setDate(undefined);
                setRequestType("");
              }}
              className="flex items-center"
            >
              Clear
              <X className="ml-1 size-4" />
            </Button>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                role="combobox"
                size="sm"
                aria-expanded={open}
                disabled={isLoading}
                className={cn(
                  "w-fit justify-between",
                  !requestType && "text-muted-foreground"
                )}
              >
                {requestType ? (
                  <P>{textTransform(requestType)}</P>
                ) : (
                  "Select service..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search service..." />
                <CommandList>
                  <CommandEmpty>No service found.</CommandEmpty>
                  <CommandGroup>
                    {RequestTypeSchema.options.map((service) => (
                      <CommandItem
                        key={service}
                        value={service}
                        onSelect={(currentValue) => {
                          setRequestType(
                            currentValue === requestType
                              ? ""
                              : (currentValue as RequestTypeType)
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            requestType === service
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {textTransform(service)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="secondary"
                disabled={isLoading}
                size="sm"
                className={cn(
                  "w-fit justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
            <AdminSearchInput />
          </Popover>
        </div>
      </div>
      {isLoading ? (
        <div className="h-screen w-full p-3">
          <OverviewSkeleton />
        </div>
      ) : isError || !data ? (
        <div className="flex h-screen w-full items-center justify-center">
          <FetchDataError refetch={refetch} />
        </div>
      ) : (
        <div className="scroll-bar container flex flex-1 justify-center overflow-y-auto p-3">
          <div className="grid h-fit w-full grid-flow-row grid-cols-3 gap-3 pb-3">
            <SystemKPICards
              data={filteredData}
              className="col-span-3"
              dateRange={date}
              requestType={requestType}
            />
            <RequestChart
              data={filteredData}
              className="col-span-3 h-[400px]"
              requestType={requestType}
              dateRange={date}
            />
            <Card className="col-span-3 bg-secondary">
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>
                  Overview of the latest requests in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.requests.slice(0, 5).map((request) => {
                    const { color, stroke, variant } = getStatusColor(
                      request.status
                    );
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <Link
                            href={`/admin/requests/${request.id}`}
                            className={cn(
                              buttonVariants({ variant: "link" }),
                              "p-0 text-foreground"
                            )}
                          >
                            <P className="truncate font-medium">
                              {request.title}
                            </P>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Requester:{" "}
                            {formatFullName(
                              request.user.firstName,
                              request.user.middleName,
                              request.user.lastName
                            )}
                          </p>
                        </div>
                        <Badge variant={variant} className="pr-3.5">
                          <Dot
                            className="mr-1 size-3"
                            strokeWidth={stroke}
                            color={color}
                          />
                          {textTransform(request.status)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <RequestsTable
              data={filteredData.requests}
              className="col-span-3"
            />
            <Card className="col-span-3 bg-secondary">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Link
                  href={`/admin/requests`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" })
                  )}
                >
                  <P>View All Requests </P>
                </Link>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
                <Button variant="outline" size="sm">
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
