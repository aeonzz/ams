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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn, getVehicleStatusIcon, textTransform } from "@/lib/utils";
import { Vehicle } from "prisma/generated/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransportRequestSchema } from "@/lib/schema/request";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, H5 } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";


interface VehicleFieldProps {
  form: UseFormReturn<TransportRequestSchema>;
  name: Path<TransportRequestSchema>;
  isPending: boolean;
}

export default function VehicleField({
  form,
  name,
  isPending,
}: VehicleFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<Vehicle[]>({
    queryFn: async () => {
      const res = await axios.get("/api/vehicles");
      return res.data.data;
    },
    queryKey: ["get-vehicles"],
    refetchOnWindowFocus: false,
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Venue</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="secondary"
                  role="combobox"
                  disabled={isPending || isLoading}
                  className={cn(
                    "justify-start",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data?.find((vehicle) => vehicle.id === field.value)?.name
                    : "Select vehicle"}
                  {isLoading ? (
                    <LoadingSpinner className="ml-auto" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command className="max-h-80">
                <CommandInput placeholder="Search vehicles..." />
                <CommandList>
                  <CommandEmpty>No vehicles found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((vehicle) => {
                      const { icon: Icon, variant } = getVehicleStatusIcon(
                        vehicle.status
                      );
                      return (
                        <CommandItem
                          value={vehicle.id}
                          key={vehicle.id}
                          onSelect={() => {
                            form.setValue("vehicleId", vehicle.id);
                            setOpen(false);
                          }}
                          className="items-start"
                        >
                          <div className="flex gap-2">
                            <div className="size-16 rounded-lg bg-tertiary"></div>
                            <div className="flex flex-col">
                              <H5 className="font-semibold">{vehicle.name}</H5>
                              <Badge variant={variant}>
                                <Icon className="size-4 mr-1" />
                                {textTransform(vehicle.status)}
                              </Badge>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              vehicle.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
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
