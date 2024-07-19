"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
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
  CheckIcon,
  CircleArrowUp,
  Cog,
  Construction,
  FileQuestion,
  Hammer,
  LucideIcon,
  Paintbrush,
  PocketKnife,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Item = {
  value: string;
  label: string;
};

export const items: Item[] = [
  {
    value: "repair",
    label: "Repair",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
];

export default function ItemOption() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  let Icon = null;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="px-2"
        >
          {value ? (
            <>{items.find((item) => item.value === value)?.label}</>
          ) : (
            <>Job type</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Choose job type..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(value) => {
                    setValue(value === value ? "" : value);
                    setOpen(false);
                  }}
                >
                  {type.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
