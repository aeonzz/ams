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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography/text";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import type { VenueRequestSchema } from "@/lib/schema/request";

interface VenueSetupRequirement {
  id: string;
  name: string;
}

interface VenueSetupRequirementsProps {
  form: UseFormReturn<VenueRequestSchema>;
  isPending: boolean;
  data: VenueSetupRequirement[] | undefined;
}

export default function VenueSetupRequirements({
  form,
  isPending,
  data,
}: VenueSetupRequirementsProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="setupRequirements"
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col">
          <FormLabel>Venue Setup Requirements</FormLabel>
          <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={isPending || !data}
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length
                      ? `${field.value.length} selected`
                      : "Select items"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((requirement) => (
                        <CommandItem
                          key={requirement.id}
                          value={requirement.name}
                          onSelect={() => {
                            const currentValue = field.value || [];
                            const newValue = currentValue.includes(
                              requirement.name
                            )
                              ? currentValue.filter((v) => v !== requirement.name)
                              : [...currentValue, requirement.name];
                            field.onChange(newValue);
                          }}
                          className="flex items-center"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(requirement.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <P className="truncate">{requirement.name}</P>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {field.value.map((name, index) => {
                  const requirement = data?.find((r) => r.name === name);
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {requirement?.name}

                      <Button
                        type="button"
                        variant="ghost2"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                          const newValue = field.value.filter((v) => v !== name);
                          field.onChange(newValue);
                        }}
                        disabled={isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
