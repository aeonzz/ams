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
import { Path, UseFormReturn } from "react-hook-form";
import { cn, getVenueStatusIcon, textTransform } from "@/lib/utils";
import { type Venue } from "prisma/generated/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type VenueRequestSchema } from "@/lib/schema/request";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface VenueProps {
  form: UseFormReturn<VenueRequestSchema>;
  name: Path<VenueRequestSchema>;
  isPending: boolean;
}

export default function VenueField({ form, name, isPending }: VenueProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<Venue[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/venue");
      return res.data.data;
    },
    queryKey: ["get-input-venue"],
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
                    "justify-start truncate",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <p className="truncate">
                      {data?.find((venue) => venue.id === field.value)?.name}
                    </p>
                  ) : (
                    "Select venue"
                  )}
                  {isLoading ? (
                    <LoadingSpinner className="ml-auto" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command className="max-h-[300px]">
                <CommandInput placeholder="Search venues..." />
                <CommandList>
                  <CommandEmpty>No venues found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((venue) => {
                      const { icon: Icon, variant } = getVenueStatusIcon(
                        venue.status
                      );
                      return (
                        <CommandItem
                          value={venue.id}
                          key={venue.id}
                          onSelect={() => {
                            form.setValue("venueId", venue.id);
                            setOpen(false);
                          }}
                        >
                          <div className="flex w-full space-x-3">
                            <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                              <Image
                                src={venue.imageUrl}
                                alt={`Image of ${venue.name}`}
                                fill
                                className="rounded-md border object-cover"
                              />
                            </div>
                            <div className="flex flex-grow flex-col justify-between">
                              <div className="space-y-1 truncate">
                                <P className="truncate">{venue.name}</P>
                                <Badge variant={variant} className="ml-auto">
                                  <Icon className="mr-1 size-4" />
                                  {textTransform(venue.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              venue.id === field.value
                                ? "opacity-100"
                                : "opacity-0",
                              "self-start"
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
