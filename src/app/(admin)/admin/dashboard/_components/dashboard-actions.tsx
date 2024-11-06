"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import {
  CalendarCog,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Clipboard,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import { P } from "@/components/typography/text";
import { RequestTypeSchema } from "prisma/generated/zod";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface DashboardActionsProps {
  requestType: RequestTypeType | "";
  isLoading: boolean;
  setRequestType: (requestType: RequestTypeType | "") => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  generatePDF: () => void;
  isGenerating: boolean;
}

export default function DashboardActions({
  requestType,
  setRequestType,
  isLoading,
  date,
  setDate,
  generatePDF,
  isGenerating,
}: DashboardActionsProps) {
  const [open, setOpen] = React.useState(false);
  const isFiltered = date?.from !== undefined || requestType !== "";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="relative"
          disabled={isLoading}
        >
          {isFiltered && (
            <div className="absolute left-6 top-1 size-2.5 rounded-full border-2 border-tertiary bg-red-500" />
          )}
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[400px] p-0">
        <div className="flex flex-col gap-2 px-4 py-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 items-center text-muted-foreground">
              <Tag strokeWidth={3} className="mr-2 h-4 w-4" />
              <P className="font-semibold tracking-tight">Request type</P>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  size="sm"
                  aria-expanded={open}
                  disabled={isLoading}
                  className={cn("flex-1 justify-between")}
                >
                  {requestType ? (
                    <P>{textTransform(requestType)}</P>
                  ) : (
                    "Select service..."
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 items-center text-muted-foreground">
              <CalendarCog strokeWidth={3} className="mr-2 h-4 w-4" />
              <P className="font-semibold tracking-tight">Date range</P>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="secondary"
                  disabled={isLoading}
                  size="sm"
                  className={cn("flex-1 justify-between")}
                >
                  <p className="truncate">
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
                  </p>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
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
        <Separator />
        <div className="flex flex-col gap-2 p-4 py-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 items-center text-muted-foreground">
              <Clipboard strokeWidth={3} className="mr-2 h-4 w-4" />
              <P className="font-semibold tracking-tight">Generate report</P>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePDF}
              disabled={isGenerating}
            >
              {isGenerating && <LoadingSpinner className="mr-2" />}
              Download{isGenerating && "ing"} Report
            </Button>
          </div>
        </div>
        {isFiltered && (
          <>
            <Separator />
            <div className="flex flex-col gap-3 p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDate(undefined);
                  setRequestType("");
                }}
                className="flex items-center"
              >
                Reset
                <X className="ml-1 size-4" />
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
