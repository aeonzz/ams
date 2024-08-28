"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon, XCircle, ChevronDown, X } from "lucide-react";
import type { Path, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { type ReturnableResourceRequestSchema } from "@/lib/schema/resource/returnable-resource";
import { type ReturnableItem } from "prisma/generated/zod";

interface ItemsFieldProps {
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  name: Path<ReturnableResourceRequestSchema>;
  isPending: boolean;
}

export default function ItemsField({ form, name, isPending }: ItemsFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data: options, isLoading } = useQuery<ReturnableItem[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items/returnable");
      return res.data.data;
    },
    queryKey: ["get-input-returnable-resources"],
    refetchOnWindowFocus: false,
  });

  const selectedValues = form.watch(name) as ReturnableItem[] | undefined;

  const handleSelect = (value: string) => {
    const currentValues = (form.getValues(name) as ReturnableItem[]) || [];
    const newValues = currentValues.some((v) => v.id === value)
      ? currentValues.filter((v) => v.id !== value)
      : [...currentValues, options?.find((o) => o.id === value)!];
    form.setValue(name, newValues, { shouldValidate: true });
  };

  const handleRemove = (value: string) => {
    const currentValues = (form.getValues(name) as ReturnableItem[]) || [];
    const newValues = currentValues.filter((v) => v.id !== value);
    form.setValue(name, newValues, { shouldValidate: true });
  };

  const toggleAll = () => {
    if (!options) return;
    const allValues = options;
    const newValues = selectedValues && selectedValues.length === options.length ? [] : allValues;
    form.setValue(name, newValues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Resources</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoading || isPending}
                >
                  {selectedValues && selectedValues.length > 0
                    ? `${selectedValues.length} selected`
                    : "Select resources"}
                  {isLoading ? (
                    <LoadingSpinner className="ml-auto" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search resources..." />
                  <CommandList>
                    <CommandEmpty>No resources found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={toggleAll}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues && options && selectedValues.length === options.length
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>Select All</span>
                      </CommandItem>
                      {options?.map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => handleSelect(item.id)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues && selectedValues.some((v) => v.id === item.id)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedValues && selectedValues.map((value) => {
              const item = options?.find((o) => o.id === value.id);
              return (
                <Badge key={value.id} variant="secondary">
                  {item?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={() => handleRemove(value.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
