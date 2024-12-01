import React from "react";
import Image from "next/image";
import { Check, ChevronsUpDown, Dot } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Path, UseFormReturn } from "react-hook-form";
import { cn, getVenueStatusColor, textTransform } from "@/lib/utils";
import type { VenueWithRelations } from "prisma/generated/zod";
import type { VenueRequestSchema } from "@/lib/schema/request";

interface VenueProps {
  form: UseFormReturn<VenueRequestSchema>;
  name: Path<VenueRequestSchema>;
  isPending: boolean;
  data: VenueWithRelations[] | undefined;
}

export default function VenueField({
  form,
  name,
  isPending,
  data,
}: VenueProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col">
          <FormLabel>Venue</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isPending}
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
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
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
                      const status = getVenueStatusColor(venue.status);
                      const isDisabled =
                        venue.status === "CLOSED" ||
                        venue.status === "UNDER_MAINTENANCE";

                      return (
                        <CommandItem
                          value={venue.id}
                          key={venue.id}
                          disabled={isDisabled}
                          onSelect={() => {
                            if (!isDisabled) {
                              field.onChange(venue.id);
                              setOpen(false);
                            }
                          }}
                          className={cn(
                            "flex w-full items-center space-x-3",
                            isDisabled && "cursor-not-allowed opacity-50"
                          )}
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
                                <p className="truncate">{venue.name}</p>
                                <Badge
                                  variant={status.variant}
                                  className="pr-3.5"
                                >
                                  <Dot
                                    className="mr-1 size-3"
                                    strokeWidth={status.stroke}
                                    color={status.color}
                                  />
                                  {textTransform(venue.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {!isDisabled && (
                            <Check
                              className={cn(
                                "h-4 w-4",
                                venue.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                                "self-start"
                              )}
                            />
                          )}
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
