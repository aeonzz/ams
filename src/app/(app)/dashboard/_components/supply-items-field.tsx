"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import {
  SupplyItemCategorySchema,
  SupplyItemWithRelations,
} from "prisma/generated/zod";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";

interface CommandProps {
  onItemsChange: (items: { supplyItemId: string; quantity: number }[]) => void;
  isPending: boolean;
}

export default function SupplyItemsField({
  onItemsChange,
  isPending,
}: CommandProps) {
  const { data: items, isLoading } = useQuery<SupplyItemWithRelations[]>({
    queryKey: ["get-input-supply-resource"],
    queryFn: async () => {
      const response = await axios.get("/api/input-data/resource-items/supply");
      return response.data.data;
    },
  });

  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    SupplyItemCategorySchema.options[0] // Default category
  );
  const [selectedItems, setSelectedItems] = React.useState<
    { supplyItemId: string; quantity: number }[]
  >([]);

  const categories = SupplyItemCategorySchema.options;

  const filteredItems = items?.filter(
    (item) => item.category === selectedCategory
  );

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.supplyItemId === itemId);
      if (itemExists) {
        return prevItems;
      }
      return [...prevItems, { supplyItemId: itemId, quantity: 1 }];
    });
    setOpen(false);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = quantity;
    setSelectedItems(newItems);
    onItemsChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
    onItemsChange(newItems);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            disabled={isPending || isLoading}
          >
            Add Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[470px] p-0">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {textTransform(category)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {filteredItems?.length ? (
            <Command>
              <CommandInput placeholder="Search items..." />
              <CommandList>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleItemSelect(item.id)}
                    className="flex items-center cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedItems.some((selectedItem) => selectedItem.supplyItemId === item.id) ? "opacity-100" : "opacity-0"}`}
                    />
                    {item.name}
                  </CommandItem>
                ))}
                <CommandEmpty>No items found</CommandEmpty>
              </CommandList>
            </Command>
          ) : (
            <div>No items found</div>
          )}
        </PopoverContent>
      </Popover>
      {selectedItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <p className="truncate">{item.supplyItemId}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(index, parseInt(e.target.value, 10))
            }
            className="input"
          />
          <Button variant="destructive" onClick={() => handleRemoveItem(index)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
