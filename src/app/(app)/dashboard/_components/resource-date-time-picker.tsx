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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
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
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { CalendarIcon, CircleOff, Dot } from "lucide-react";
import {
  cn,
  formatFullName,
  getStatusColor,
  isDateInPast,
  textTransform,
} from "@/lib/utils";
import { type ReservedReturnableItemDateAndTime } from "@/lib/schema/utils";
import { P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";

interface DateTimePickerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  isLoading?: boolean;
  disabled: boolean;
  disabledDates?: Date[];
  disabledTimeRanges?: { start: Date; end: Date }[];
  label?: string;
  reservations?: ReservedReturnableItemDateAndTime[];
}

const timePresets = [
  // { label: "4:30 AM", hours: 4, minutes: 30 },
  // { label: "5:30 AM", hours: 5, minutes: 30 },
  // { label: "6:00 AM", hours: 6, minutes: 0 },
  // { label: "6:30 AM", hours: 6, minutes: 30 },
  { label: "7:00 AM", hours: 7, minutes: 0 },
  { label: "7:30 AM", hours: 7, minutes: 30 },
  { label: "8:00 AM", hours: 8, minutes: 0 },
  { label: "8:30 AM", hours: 8, minutes: 0 },
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

export default function ResourceDateTimePicker<T extends FieldValues>({
  form,
  isLoading = false,
  disabled = false,
  name,
  label,
  disabledDates = [],
  disabledTimeRanges = [],
  reservations = [],
}: DateTimePickerProps<T>) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth()
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

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

  const getNextAvailableTimePreset = (startTime: Date) => {
    for (const preset of timePresets) {
      const presetTime = setMinutes(
        setHours(startTime, preset.hours),
        preset.minutes
      );
      if (
        !isTimeDisabled(preset.hours, preset.minutes) &&
        isAfter(presetTime, new Date())
      ) {
        return preset.label;
      }
    }
    return null;
  };

  const resetTimePreset = (date: Date) => {
    // Automatically select the next available time preset for the selected date
    const nextAvailableTime = getNextAvailableTimePreset(date);
    if (nextAvailableTime) {
      setSelectedTime(nextAvailableTime);

      const [hours, minutes] = nextAvailableTime
        .split(":")
        .map((str) => parseInt(str.split(" ")[0], 10));

      const adjustedHours = hours === 12 ? 12 : hours + 12;

      const updatedDate = setHours(
        setMinutes(new Date(date), minutes),
        adjustedHours
      );

      form.setValue(name, updatedDate as PathValue<T, Path<T>>);
    }
  };

  const reservationsForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return [];
    return reservations.filter(
      (reservation) =>
        isSameDay(new Date(reservation.dateAndTimeNeeded), selectedDate) ||
        isSameDay(new Date(reservation.returnDateAndTime), selectedDate) ||
        (selectedDate >= new Date(reservation.dateAndTimeNeeded) &&
          selectedDate <= new Date(reservation.returnDateAndTime))
    );
  }, [selectedDate, reservations]);

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label && <FormLabel className="text-left">{label}</FormLabel>}
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
              <PopoverContent className="flex h-fit w-auto p-0">
                <div className="flex">
                  {reservationsForSelectedDate.length > 0 ? (
                    <div className="w-[270px] p-3">
                      <P className="mb-2 font-medium">
                        Reservations for{" "}
                        {selectedDate
                          ? format(selectedDate, "P")
                          : "Selected Date"}
                      </P>
                      <div className="scroll-bar h-[250px] overflow-y-auto">
                        {reservationsForSelectedDate.map(
                          (reservation, index) => {
                            const statusColor = getStatusColor(
                              reservation.request.status
                            );

                            return (
                              <div
                                key={index}
                                className="border-y py-2 text-sm"
                              >
                                <p>
                                  <strong>{reservation.item.name}</strong>
                                </p>
                                <p>
                                  {format(
                                    new Date(reservation.dateAndTimeNeeded),
                                    "MMM d, h:mm a"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(reservation.returnDateAndTime),
                                    "MMM d, h:mm a"
                                  )}
                                </p>
                                <div className="flex flex-col">
                                  <P className="text-xs text-muted-foreground">
                                    Requested by:
                                  </P>
                                  <P>
                                    {formatFullName(
                                      reservation.request.user.firstName,
                                      reservation.request.user.middleName,
                                      reservation.request.user.lastName
                                    )}
                                  </P>
                                  <Badge
                                    variant={statusColor.variant}
                                    className="mt-1 w-fit pr-3.5"
                                  >
                                    <Dot
                                      className="mr-1 size-3"
                                      strokeWidth={statusColor.stroke}
                                      color={statusColor.color}
                                    />
                                    {textTransform(reservation.request.status)}
                                  </Badge>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-[270px] flex-col items-center justify-center">
                      <CircleOff className="mb-2 size-6 text-muted-foreground" />
                      <P className="text-muted-foreground">No Reservations</P>
                    </div>
                  )}
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
                      setSelectedDate(date || null);
                      setSelectedTime(timePresets[0].label);
                      if (date) {
                        const newDate = field.value
                          ? new Date(field.value)
                          : new Date(new Date().setHours(7, 0, 0, 0));
                        newDate.setFullYear(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        );
                        field.onChange(newDate);
                        resetTimePreset(newDate);
                      } else {
                        field.onChange(date);
                      }
                    }}
                    disabled={isDateInPast}
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
