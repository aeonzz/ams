"use client";

import React from "react";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn, getVehicleStatusColor, textTransform } from "@/lib/utils";
import { Vehicle } from "prisma/generated/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransportRequestSchema } from "@/lib/schema/request";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface VehicleFieldProps {
  form: UseFormReturn<TransportRequestSchema>;
  name: Path<TransportRequestSchema>;
  isPending: boolean;
  data: Vehicle[] | undefined;
}

export default function VehicleField({
  form,
  name,
  isPending,
  data,
}: VehicleFieldProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-1">
          <FormLabel>Vehicle</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isPending}
                  className={cn(
                    "justify-start",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <p className="truncate">
                      {data?.find((venue) => venue.id === field.value)?.name}
                    </p>
                  ) : (
                    "Select vehicle"
                  )}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search vehicles..." />
                <CommandList>
                  <CommandEmpty>No vehicles found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((vehicle) => {
                      const status = getVehicleStatusColor(vehicle.status);
                      return (
                        <CommandItem
                          value={vehicle.id}
                          key={vehicle.id}
                          onSelect={() => {
                            form.setValue("vehicleId", vehicle.id);
                            setOpen(false);
                          }}
                        >
                          <div className="flex w-full space-x-3">
                            <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                              <Image
                                src={vehicle.imageUrl}
                                alt={`Image of ${vehicle.name}`}
                                fill
                                className="rounded-md border object-cover"
                              />
                            </div>
                            <div className="flex flex-grow flex-col justify-between">
                              <div className="space-y-1 truncate">
                                <P className="truncate">{vehicle.name}</P>
                                <Badge
                                  variant={status.variant}
                                  className="pr-3.5"
                                >
                                  <Dot
                                    className="mr-1 size-3"
                                    strokeWidth={status.stroke}
                                    color={status.color}
                                  />
                                  {textTransform(vehicle.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="self-start pt-1">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vehicle.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
