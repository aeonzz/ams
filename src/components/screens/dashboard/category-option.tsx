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
import { ItemCategory } from "prisma/generated/zod";
import ItemOption from "./item-option";
import { P } from "@/components/typography/text";

interface CategoryOptionProps {
  item: string;
  setItem: (item: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
}

export type Item = {
  value: string;
  label: string;
};

export type CategoryType = "other" | "electronics" | "furniture";

export type Category = {
  value: CategoryType;
  label: string;
};

export const categoryTypes: Category[] = [
  {
    value: "electronics",
    label: "Electronics",
  },
  {
    value: "furniture",
    label: "Furniture",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function CategoryOption({
  item,
  setItem,
  category,
  setCategory,
}: CategoryOptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <P className="text-muted-foreground">Item to repair</P>
      <div className="space-x-1">
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="px-2"
            >
              {category ? <>{category.label}</> : <>Category</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[230px] p-0" align="start">
            <Command className="max-h-72">
              <CommandInput placeholder="Choose category..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {categoryTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(value) => {
                        setCategory(
                          categoryTypes.find(
                            (category) => category.value === value
                          ) || categoryTypes[0]
                        );
                        setOpen(false);
                      }}
                    >
                      {type.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          type.value === category?.value
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
        <ItemOption item={item} setItem={setItem} category={category?.value} />
      </div>
    </div>
  );
}
