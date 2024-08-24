"use client";

import { createRequest } from "@/lib/actions/requests";
import { VenueRequestSchema } from "@/lib/schema/request";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import React from "react";
import { UseFormReturn } from "react-hook-form";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/text-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn, isDateInPast } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";

const purpose = [
  {
    id: "lecture",
    label: "Lecture/Forum/Symposium",
  },
  {
    id: "film showing",
    label: "Film Showing",
  },
  {
    id: "seminar",
    label: "Seminar/Workshop",
  },
  {
    id: "video coverage",
    label: "Video Coverage",
  },
  {
    id: "college meeting",
    label: "College Meeting/Conference",
  },
] as const;

const venues = [{ label: "Audio Visual Room", value: "avr" }] as const;

interface VenueRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<VenueRequestSchema>;
}

export default function VenueRequestInput({
  form,
  mutateAsync,
  isPending,
}: VenueRequestInputProps) {
  async function onSubmit(values: VenueRequestSchema) {}

  return (
    <>
      <DialogHeader>
        <DialogTitle>Job Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex space-x-3 px-4">
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-muted-foreground">
                      Venue
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="secondary"
                            size="sm"
                            role="combobox"
                            className={cn(
                              "w-[280px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? venues.find(
                                  (venue) => venue.value === field.value
                                )?.label
                              : "Select venue"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0">
                        <Command>
                          <CommandInput placeholder="Search venues..." />
                          <CommandList>
                            <CommandEmpty>No venues found.</CommandEmpty>
                            <CommandGroup>
                              {venues.map((venue) => (
                                <CommandItem
                                  value={venue.label}
                                  key={venue.value}
                                  onSelect={() => {
                                    form.setValue("venueName", venue.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      venue.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {venue.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left text-muted-foreground">
                      DateTime
                    </FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm:ss")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={isDateInPast}
                          initialFocus
                        />
                        <div className="border-t border-border p-3">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Purpose
                  </FormLabel>
                  <div className="space-y-4">
                    {purpose.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="purpose"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            <div></div>
            <SubmitButton disabled={isPending} className="w-28">
              Submit
            </SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
