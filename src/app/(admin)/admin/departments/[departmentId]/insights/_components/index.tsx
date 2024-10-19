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
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import DepartmentInsightsSkeleton from "./department-insights-skeleton";

interface DepartmentInsightsScreenProps {
  departmentId: string;
}

export default function DepartmentInsightsScreen({
  departmentId,
}: DepartmentInsightsScreenProps) {
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
          {date?.from !== undefined && (
            <Button
              variant="ghost2"
              onClick={() => setDate(undefined)}
              className="flex items-center"
            >
              Clear
              <X className="ml-1 size-4" />
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="secondary"
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
      <div className="grid h-fit grid-flow-row grid-cols-3 gap-3">
        <DepartmentKPICards
          data={data}
          className="col-span-3"
          dateRange={date}
        />
        <RequestStatusOverview data={data} className="h-[400px]" />
        <RequestChart
          data={data}
          className="col-span-2 h-[400px]"
          dateRange={date}
        />
        <DepartmentRequestsTable data={data.request} className="col-span-3" />
      </div>
    </div>
  );
}
