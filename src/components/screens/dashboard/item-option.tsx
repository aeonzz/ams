"use client";

import React, { useEffect, useState } from "react";

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
import { CategoryType, Item } from "./category-option";
import { Textarea } from "@/components/ui/text-area";

interface ItemOptionProps {
  item: string;
  setItem: (item: string) => void;
  category?: CategoryType;
}

type CategoryItems = {
  category: CategoryType;
  items: Item[];
};

export const categoryItems: CategoryItems[] = [
  {
    category: "electronics",
    items: [
      {
        value: "aircon",
        label: "Aircon",
      },
      {
        value: "phone",
        label: "Phone",
      },
      {
        value: "other",
        label: "Other",
      },
    ],
  },
  {
    category: "furniture",
    items: [
      {
        value: "table",
        label: "Table",
      },
      {
        value: "chair",
        label: "Chair",
      },
      {
        value: "other",
        label: "Other",
      },
    ],
  },
  {
    category: "other",
    items: [
      {
        value: "table",
        label: "Table",
      },
      {
        value: "chair",
        label: "Chair",
      },
      {
        value: "other",
        label: "Other",
      },
    ],
  },
];

export default function ItemOption({
  item,
  setItem,
  category,
}: ItemOptionProps) {
  const [open, setOpen] = useState(false);
  const [openTextbox, setOpenTextbox] = useState(false);

  const categoryData = categoryItems.find((cat) => cat.category === category);
  const items = categoryData ? categoryData.items : [];
  const currentItem = items.find((value) => value.value === item);

  useEffect(() => {
    setItem("");
  }, [category]);

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
          {item ? <>{currentItem?.label ?? item}</> : <>{items[0].label}</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[230px] p-0"
        align="start"
        onInteractOutside={() => {
          setOpenTextbox(false);
        }}
      >
        <Command className="max-h-72">
          <CommandInput placeholder="Choose item..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(value) => {
                    if (type.value === "other") {
                      setOpenTextbox(true);
                    } else {
                      setOpenTextbox(false);
                      setItem(
                        items.find((item) => item.value === value)?.value ?? ""
                      );
                      setOpen(false);
                    }
                  }}
                >
                  {type.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      item === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {openTextbox && (
              <div className="p-1">
                <Textarea
                  rows={1}
                  maxRows={8}
                  onChange={(e) => {
                    setItem(
                      `${e.target.value.charAt(0).toUpperCase()}${e.target.value.slice(1)}`
                    );
                  }}
                  placeholder="Specify the item"
                  className="min-h-20"
                  defaultSize="text-sm"
                  small="text-xs"
                  large="text-base"
                />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
