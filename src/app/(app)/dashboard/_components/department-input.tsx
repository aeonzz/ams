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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography/text";
import type { Path, UseFormReturn } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

interface Item {
  id: string;
  name: string;
}

interface DepartmentInputProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  items: Item[] | undefined;
  isPending: boolean;
  isLoading: boolean;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export default function DepartmentInput<T extends Record<string, any>>({
  form,
  name,
  label,
  items,
  isPending,
  isLoading,
  placeholder = "Select an item",
  emptyMessage = "No items found.",
  className,
}: DepartmentInputProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "mb-10 flex flex-1 flex-col items-center gap-3",
            className
          )}
        >
          <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                {isLoading ? (
                  <Skeleton className="h-10 w-48" />
                ) : (
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={isPending || !items}
                    className={cn(
                      "w-fit justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? items?.find((item) => item.id === field.value)?.id
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                )}
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search departments..." />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {items?.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => {
                          field.onChange(item.id);
                          setOpen(false);
                        }}
                        className="flex items-center"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === item.id
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
