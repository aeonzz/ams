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
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Type = {
  value: string;
  label: string;
};

const types: Type[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export default function RequestTypeOption() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<Type | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          role="combobox"
          aria-expanded={open}
        >
          {selectedType ? <>{selectedType.label}</> : <>+ Set type</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Choose Request type..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {types.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(value) => {
                    setSelectedType(
                      types.find((priority) => priority.value === value) || null
                    );
                    setOpen(false);
                  }}
                >
                  {type.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedType?.value === type.value
                        ? "opacity-100"
                        : "opacity-0"
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
