"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CommandGroup,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface SupplyItemsFieldProps {
  onItemsChange: (items: { supplyItemId: string; quantity: number }[]) => void;
  isPending: boolean;
}

export default function SupplyItemsField({
  onItemsChange,
  isPending,
}: SupplyItemsFieldProps) {
  const { data: items, isLoading } = useQuery<SupplyItemWithRelations[]>({
    queryKey: ["get-input-supply-resource"],
    queryFn: async () => {
      const response = await axios.get("/api/input-data/resource-items/supply");
      return response.data.data;
    },
  });

  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    SupplyItemCategorySchema.options[0]
  );
  const [selectedItems, setSelectedItems] = React.useState<
    { supplyItemId: string; quantity: number }[]
  >([]);

  const categories = SupplyItemCategorySchema.options;

  const filteredItems = React.useMemo(
    () => items?.filter((item) => item.category === selectedCategory),
    [items, selectedCategory]
  );

  const handleItemSelect = React.useCallback(
    (item: SupplyItemWithRelations) => {
      setSelectedItems((prevItems) => {
        const itemExists = prevItems.find((i) => i.supplyItemId === item.id);
        if (itemExists) {
          return prevItems;
        }
        const newItems = [...prevItems, { supplyItemId: item.id, quantity: 1 }];
        onItemsChange(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  const handleQuantityChange = React.useCallback(
    (supplyItemId: string, quantity: number) => {
      setSelectedItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.supplyItemId === supplyItemId ? { ...item, quantity } : item
        );
        onItemsChange(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  const handleRemoveItem = React.useCallback(
    (supplyItemId: string) => {
      setSelectedItems((prevItems) => {
        const newItems = prevItems.filter(
          (item) => item.supplyItemId !== supplyItemId
        );
        onItemsChange(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isPending || isLoading}
        >
          {selectedItems.length > 0
            ? `${selectedItems.length} item${
                selectedItems.length > 1 ? "s" : ""
              } selected`
            : "Select items"}
          {isLoading ? (
            <LoadingSpinner className="ml-2" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-3">
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Items</TabsTrigger>
            <TabsTrigger value="selected">Selected Items</TabsTrigger>
          </TabsList>
          <TabsContent value="select">
            <div className="flex">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup heading="Categories">
                    {categories.map((category) => (
                      <CommandItem
                        key={category}
                        onSelect={() => setSelectedCategory(category)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategory === category
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {textTransform(category)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedCategory && (
                <Command>
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup heading="Items">
                      <ScrollArea className="h-[200px]">
                        {filteredItems?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleItemSelect(item)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedItems.some(
                                  (i) => i.supplyItemId === item.id
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.name}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </div>
          </TabsContent>
          <TabsContent value="selected">
            <div className="scroll-bar h-[300px] overflow-y-auto p-4">
              {selectedItems.length > 0 ? (
                <div className="space-y-4">
                  {selectedItems.map((selectedItem) => {
                    const item = items?.find(
                      (i) => i.id === selectedItem.supplyItemId
                    );
                    return (
                      <Card
                        key={selectedItem.supplyItemId}
                        className="bg-secondary"
                      >
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {item?.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveItem(selectedItem.supplyItemId)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="mb-2 text-sm text-gray-500">
                            {item?.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Label
                              htmlFor={`quantity-${selectedItem.supplyItemId}`}
                            >
                              Quantity:
                            </Label>
                            <Input
                              id={`quantity-${selectedItem.supplyItemId}`}
                              type="number"
                              min="1"
                              value={selectedItem.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  selectedItem.supplyItemId,
                                  parseInt(e.target.value, 10)
                                )
                              }
                              className="w-20"
                            />
                            <span className="text-sm text-gray-500">
                              {item?.unit}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No items selected yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
