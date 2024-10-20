"use client";

import React from "react";
import FetchDataError from "@/components/card/fetch-data-error";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import RequestStatusOverview from "./request-status-overview";
import RequestChart from "./request-chart";
import DepartmentKPICards from "./department-kpi-cards";
import DepartmentRequestsTable from "./requests-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, textTransform } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import DepartmentInsightsSkeleton from "./department-insights-skeleton";
import { ItemRequestsChart } from "./item-requests-chart";
import { OverdueItemsChart } from "./overdue-items-chart";
import { RequestTypeSchema } from "prisma/generated/zod";
import { P } from "@/components/typography/text";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";

interface DepartmentInsightsScreenProps {
  departmentId: string;
}

export default function DepartmentInsightsScreen({
  departmentId,
}: DepartmentInsightsScreenProps) {
  const [requestType, setRequestType] = React.useState<RequestTypeType | "">(
    ""
  );
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  if (isLoading) {
    return (
      <div className="w-full">
        <DepartmentInsightsSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div></div>
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
                className={cn(
                  "w-[200px] justify-between",
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
                    {RequestTypeSchema.options
                      .filter(
                        (service) =>
                          (service !== "JOB" || data.acceptsJobs) &&
                          (service !== "TRANSPORT" || data.managesTransport) &&
                          (service !== "RESOURCE" ||
                            data.managesBorrowRequest) &&
                          (service !== "VENUE" || data.managesFacility)
                      )
                      .map((service) => (
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
                size="sm"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
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
          </Popover>
        </div>
      </div>
      <div className="grid h-fit grid-flow-row grid-cols-3 gap-3 pb-3">
        <DepartmentKPICards
          data={data}
          className="col-span-3"
          dateRange={date}
          requestType={requestType}
        />
        <RequestStatusOverview
          data={data}
          requestType={requestType}
          className="h-[400px]"
        />
        <RequestChart
          data={data}
          className="col-span-2 h-[400px]"
          requestType={requestType}
          dateRange={date}
        />
        {requestType === "RESOURCE" && (
          <>
            <OverdueItemsChart
              data={data}
              className="col-span-2 h-[400px]"
              dateRange={
                date?.from && date?.to
                  ? { from: date.from, to: date.to }
                  : undefined
              }
            />
            <ItemRequestsChart
              data={data}
              className="h-[400px]"
              dateRange={
                date?.from && date?.to
                  ? { from: date.from, to: date.to }
                  : undefined
              }
            />
          </>
        )}
        <DepartmentRequestsTable
          data={data.request}
          requestType={requestType}
          className="col-span-3"
        />
      </div>
    </div>
  );
}
