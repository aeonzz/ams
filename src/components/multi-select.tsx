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
import type { Path, UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  name: string;
}

interface MultiSelectProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  items: Item[] | undefined;
  isPending: boolean;
  placeholder?: string;
  emptyMessage?: string;
}

export default function MultiSelect<T extends Record<string, any>>({
  form,
  name,
  label,
  items,
  isPending,
  placeholder = "Select items",
  emptyMessage = "No items found.",
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={isPending || !items}
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value && Array.isArray(field.value) && field.value.length > 0
                      ? `${field.value.length} selected`
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {items?.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={() => {
                            const currentValue = (field.value as string[]) || [];
                            const newValue = currentValue.includes(item.name)
                              ? currentValue.filter((v) => v !== item.name)
                              : [...currentValue, item.name];
                            field.onChange(newValue);
                          }}
                          className="flex items-center"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value && Array.isArray(field.value) && field.value.includes(item.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <P className="truncate">{item.name}</P>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value && Array.isArray(field.value) && field.value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {field.value.map((name: string, index: number) => {
                  const item = items?.find((r) => r.name === name);
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {item?.name}

                      <Button
                        type="button"
                        variant="ghost2"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                          const newValue = (field.value as string[]).filter((v) => v !== name);
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