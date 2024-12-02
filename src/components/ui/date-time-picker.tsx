"use client";

import React from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
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
  isAfter,
  isSameDay,
  isWithinInterval,
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
  isLoading?: boolean;
  disabled: boolean;
  disabledDates?: Date[];
  disabledTimeRanges?: { start: Date; end: Date }[];
  label?: string;
  children?: React.ReactNode;
}

const timePresets = [
  { label: "4:00 AM", hours: 4, minutes: 0 },
  { label: "4:30 AM", hours: 4, minutes: 30 },
  { label: "5:00 AM", hours: 5, minutes: 0 },
  { label: "5:30 AM", hours: 5, minutes: 30 },
  { label: "6:00 AM", hours: 6, minutes: 0 },
  { label: "6:30 AM", hours: 6, minutes: 30 },
  { label: "7:00 AM", hours: 7, minutes: 0 },
  { label: "7:30 AM", hours: 7, minutes: 30 },
  { label: "8:00 AM", hours: 8, minutes: 0 },
  { label: "8:30 AM", hours: 8, minutes: 30 },
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
  { label: "5:30 PM", hours: 17, minutes: 30 },
  { label: "6:00 PM", hours: 18, minutes: 0 },
  { label: "6:30 PM", hours: 18, minutes: 30 },
  { label: "7:00 PM", hours: 19, minutes: 0 },
  { label: "7:30 PM", hours: 19, minutes: 30 },
  { label: "8:00 PM", hours: 20, minutes: 0 },
  { label: "8:30 PM", hours: 20, minutes: 30 },
  { label: "9:00 PM", hours: 21, minutes: 0 },
  { label: "9:30 PM", hours: 21, minutes: 30 },
  { label: "10:00 PM", hours: 22, minutes: 0 },
  { label: "10:30 PM", hours: 22, minutes: 30 },
  { label: "11:00 PM", hours: 23, minutes: 0 },
  { label: "11:30 PM", hours: 23, minutes: 30 },
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
  label,
  disabledDates = [],
  disabledTimeRanges = [],
  children,
}: DateTimePickerProps<T>) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth()
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [calendarDate, setCalendarDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const handleMonthChange = (date: Date) => {
    setCalendarDate(date);
  };

  React.useEffect(() => {
    const defaultValue = form.getValues(name);
    if (defaultValue) {
      const date = new Date(defaultValue);
      setSelectedDate(date);
      setSelectedMonth(date.getMonth());

      // Find and set the matching time preset
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const matchingPreset = timePresets.find(
        (preset) => preset.hours === hours && preset.minutes === minutes
      );
      if (matchingPreset) {
        setSelectedTime(matchingPreset.label);
      }
    }
  }, [form, name]);

  const isTimeDisabled = (hours: number, minutes: number) => {
    if (!selectedDate) return false;
    const time = new Date(selectedDate);
    time.setHours(hours, minutes, 0, 0);
    if (time < new Date()) return true;
    return disabledTimeRanges.some((range) =>
      isWithinInterval(time, {
        start: range.start,
        end: range.end,
      })
    );
  };

  const isDateDisabled = (date: Date) => {
    return (
      isDateInPast(date) ||
      disabledDates.some((disabledDate) => isSameDay(date, disabledDate))
    );
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label && (
              <FormLabel className="text-left">
                {label} {children}
              </FormLabel>
            )}
            <Popover modal>
              <FormControl>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
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
                      format(field.value, "PPP hh:mm a")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent align="start" className="flex h-fit w-auto p-0">
                <div className="flex">
                  <Calendar
                    showOutsideDays={false}
                    mode="single"
                    month={calendarDate}
                    onMonthChange={handleMonthChange}
                    selected={field.value}
                    onSelect={(date) => {
                      setSelectedDate(date || null);
                      if (date) {
                        // Reset time when date changes
                        setSelectedTime(null);

                        // Create new date with no time
                        const newDate = new Date(date);
                        newDate.setHours(0, 0, 0, 0);

                        field.onChange(newDate);
                      } else {
                        field.onChange(null);
                      }
                    }}
                    initialFocus
                    disabled={isDateDisabled}
                  />
                  {form.getValues(name) && (
                    <div className="space-y-3 overflow-y-auto p-3">
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
                            <SelectItem
                              key={index}
                              value={index.toString()}
                              disabled={index < new Date().getMonth()}
                            >
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="scroll-bar flex h-[250px] flex-col gap-2 overflow-y-auto">
                        {timePresets.map((preset, index) => (
                          <Button
                            key={index}
                            variant={
                              selectedTime === preset.label
                                ? "default"
                                : "secondary"
                            }
                            onClick={() => {
                              const newDate = field.value
                                ? new Date(field.value)
                                : new Date();
                              const updatedDate = setMinutes(
                                setHours(newDate, preset.hours),
                                preset.minutes
                              );
                              field.onChange(updatedDate);
                              setSelectedTime(preset.label);
                            }}
                            disabled={isTimeDisabled(
                              preset.hours,
                              preset.minutes
                            )}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
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
