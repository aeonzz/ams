"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Dot, X } from "lucide-react";
import { cn, getSupplyStatusColor, textTransform } from "@/lib/utils";
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
import type {
  SupplyItemCategory,
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { useSupplyItemCategory } from "@/lib/hooks/use-supply-item-category";
import NumberInput from "@/components/number-input";
import Image from "next/image";
import placeholder from "@/public/placeholder.svg";
import { H4, P } from "@/components/typography/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SupplyItemsFieldProps {
  onItemsChange: (items: { supplyItemId: string; quantity: number }[]) => void;
  isPending: boolean;
  categories: SupplyItemCategory[] | undefined;
  items: SupplyItemWithRelations[] | undefined;
}

export default function SupplyItemsField({
  onItemsChange,
  isPending,
  categories,
  items,
}: SupplyItemsFieldProps) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedItems, setSelectedItems] = React.useState<
    { supplyItemId: string; quantity: number }[]
  >([]);

  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredItems = React.useMemo(
    () => items?.filter((item) => item.categoryId === selectedCategory),
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

  const handleImageLoad = (img: HTMLImageElement) => {
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const maxWidth = 400;
  const maxHeight = 300;
  const aspectRatio = dimensions.width / dimensions.height;

  let hoverCardWidth = dimensions.width;
  let hoverCardHeight = dimensions.height;

  if (hoverCardWidth > maxWidth) {
    hoverCardWidth = maxWidth;
    hoverCardHeight = hoverCardWidth / aspectRatio;
  }

  if (hoverCardHeight > maxHeight) {
    hoverCardHeight = maxHeight;
    hoverCardWidth = hoverCardHeight * aspectRatio;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            selectedItems.length === 0 && "text-muted-foreground"
          )}
          disabled={isPending}
        >
          {selectedItems.length > 0
            ? `${selectedItems.length} item${
                selectedItems.length > 1 ? "s" : ""
              } selected`
            : "Select items"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[80vh] w-[600px] overflow-auto p-3">
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="sticky top-0 z-10 mb-4 grid w-full grid-cols-2 bg-background">
            <TabsTrigger value="select">Select Items</TabsTrigger>
            <TabsTrigger value="selected" className="relative">
              Selected Items
              {selectedItems.length > 0 && (
                <span className="absolute right-[23%] top-[13%] flex size-5 items-center justify-center rounded-full bg-red-500 text-xs">
                  {selectedItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="select"
            className="max-h-[calc(80vh-100px)] overflow-auto"
          >
            <div className="flex">
              <Command className="mr-2 w-1/2">
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup heading="Categories">
                    <ScrollArea className="h-[200px]">
                      {categories?.map((category) => (
                        <CommandItem
                          key={category.id}
                          onSelect={() => setSelectedCategory(category.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === category.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {textTransform(category.name)}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
              {selectedCategory && (
                <Command className="ml-2 w-1/2">
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup heading="Items">
                      <ScrollArea className="max-h-[200px]">
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
          <TabsContent
            value="selected"
            className="scroll-bar max-h-[calc(80vh-200px)] overflow-auto"
          >
            <div className="space-y-3">
              {selectedItems.length > 0 ? (
                selectedItems.map((selectedItem) => {
                  const item = items?.find(
                    (i) => i.id === selectedItem.supplyItemId
                  );

                  if (!item)
                    return (
                      <p className="text-xs text-muted-foreground">No Items</p>
                    );

                  const status = getSupplyStatusColor(item.status);
                  return (
                    <Card
                      key={selectedItem.supplyItemId}
                      className="bg-secondary"
                    >
                      <CardContent className="flex flex-col gap-3 p-3">
                        <div className="flex">
                          <div className="flex flex-1">
                            <HoverCard closeDelay={0} openDelay={300}>
                              <HoverCardTrigger asChild>
                                <div className="relative mr-2 aspect-square h-20 cursor-pointer transition-colors hover:brightness-75">
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Image of ${item.name}`}
                                    fill
                                    className="rounded-md border object-cover"
                                    onLoadingComplete={handleImageLoad}
                                  />
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent
                                className="p-0"
                                style={{
                                  width: hoverCardWidth,
                                  height: hoverCardHeight,
                                }}
                              >
                                <div className="relative h-full w-full">
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Enlarged image of ${item.name}`}
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                            <div className="flex flex-col justify-between">
                              <div>
                                <h4 className="truncate text-lg font-semibold leading-none">
                                  {item.name}
                                </h4>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <Badge
                              variant={status.variant}
                              className="w-fit pr-3.5"
                            >
                              <Dot
                                className="mr-1 size-3"
                                strokeWidth={status.stroke}
                                color={status.color}
                              />
                              {textTransform(item.status)}
                            </Badge>
                            <p className="ml-auto text-lg font-medium">
                              {item.quantity}x
                            </p>
                            {item.expirationDate && (
                              <p className="text-xs text-muted-foreground">
                                Expires: {format(item.expirationDate, "P")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div></div>
                          <div className="flex gap-2">
                            <div className="flex items-center space-x-2">
                              <Label
                                htmlFor={`quantity-${selectedItem.supplyItemId}`}
                              >
                                Quantity{" "}
                                <span className="text-xs text-muted-foreground">
                                  ({item?.unit})
                                </span>
                                :
                              </Label>
                              <NumberInput
                                value={selectedItem.quantity}
                                min={1}
                                max={item.quantity || 30}
                                onChange={(value) =>
                                  handleQuantityChange(
                                    selectedItem.supplyItemId,
                                    value
                                  )
                                }
                                className="w-fit"
                              />
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost2"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveItem(selectedItem.supplyItemId)
                                  }
                                  className="border"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove item</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
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
