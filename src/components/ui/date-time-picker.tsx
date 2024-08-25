"use client";

import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { TimePicker } from "./time-picker";
import {
  addMonths,
  format,
  isSameDay,
  setHours,
  setMinutes,
  setMonth,
} from "date-fns";
import LoadingSpinner from "../loaders/loading-spinner";
import { CalendarIcon } from "lucide-react";
import { cn, isDateInPast } from "@/lib/utils";

interface DateTimePickerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  isLoading: boolean;
  disabled: boolean;
  disabledDates: Date[];
  label: string;
}

const timePresets = [
  { label: "9:00 AM", hours: 9, minutes: 0 },
  { label: "9:30 AM", hours: 9, minutes: 30 },
  { label: "10:00 AM", hours: 10, minutes: 0 },
  { label: "10:30 AM", hours: 10, minutes: 30 },
  { label: "11:00 AM", hours: 11, minutes: 0 },
  { label: "11:30 AM", hours: 11, minutes: 30 },
  { label: "12:00 PM", hours: 12, minutes: 0 },
  { label: "12:30 PM", hours: 12, minutes: 30 },
  { label: "1:00 PM", hours: 13, minutes: 0 },
  { label: "1:30 PM", hours: 13, minutes: 30 },
  { label: "2:00 PM", hours: 14, minutes: 0 },
  { label: "2:30 PM", hours: 14, minutes: 30 },
  { label: "3:00 PM", hours: 15, minutes: 0 },
  { label: "3:30 PM", hours: 15, minutes: 30 },
  { label: "4:00 PM", hours: 16, minutes: 0 },
  { label: "4:30 PM", hours: 16, minutes: 30 },
  { label: "5:00 PM", hours: 17, minutes: 0 },
] as const;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export default function DateTimePicker<T extends FieldValues>({
  form,
  isLoading = false,
  disabled = false,
  name,
  label = "Select Date and Time",
  disabledDates = [],
}: DateTimePickerProps<T>) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth()
  );

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-left text-muted-foreground">
              {label}
            </FormLabel>
            <Popover>
              <FormControl>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    disabled={disabled || isLoading}
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {isLoading ? (
                      <LoadingSpinner className="mr-2" />
                    ) : (
                      <CalendarIcon className="mr-2 h-4 w-4" />
                    )}
                    {field.value ? (
                      format(field.value, "PPP HH:mm")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent align="start" className="flex w-auto p-0">
                <Calendar
                  showOutsideDays={false}
                  mode="single"
                  month={addMonths(
                    new Date(),
                    selectedMonth - new Date().getMonth()
                  )}
                  onMonthChange={(date) => setSelectedMonth(date.getMonth())}
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = field.value
                        ? new Date(field.value)
                        : new Date();
                      newDate.setFullYear(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      field.onChange(newDate);
                    } else {
                      field.onChange(date);
                    }
                  }}
                  disabled={(date) =>
                    disabledDates.some((disabledDate) =>
                      isSameDay(date, disabledDate)
                    )
                  }
                  initialFocus
                />
                <div className="space-y-3 p-3">
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => {
                      const newMonth = parseInt(value);
                      setSelectedMonth(newMonth);
                      if (field.value) {
                        field.onChange(setMonth(field.value, newMonth));
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {monthNames.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={
                      field.value
                        ? `${field.value.getHours()}:${field.value.getMinutes()}`
                        : ""
                    }
                    onValueChange={(value) => {
                      const [hours, minutes] = value.split(":").map(Number);
                      const newDate = field.value
                        ? new Date(field.value)
                        : new Date();
                      field.onChange(
                        setMinutes(setHours(newDate, hours), minutes)
                      );
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timePresets.map((preset, index) => (
                        <SelectItem
                          key={index}
                          value={`${preset.hours}:${preset.minutes}`}
                        >
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <TimePicker setDate={field.onChange} date={field.value} />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
