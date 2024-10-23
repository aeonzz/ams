"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Dot, X, ChevronRight } from "lucide-react";
import { cn, getSupplyStatusColor, textTransform } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DepartmentWithRelations,
  SupplyItemCategory,
  SupplyItemCategoryWithRelations,
  SupplyItemWithRelations,
} from "prisma/generated/zod";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import NumberInput from "@/components/number-input";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { SupplyResourceRequestSchema } from "@/lib/schema/resource/supply-resource";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

interface SupplyItemsFieldProps {
  isPending: boolean;
  departments: DepartmentWithRelations[] | undefined;
  categories: SupplyItemCategoryWithRelations[] | undefined;
  items: SupplyItemWithRelations[] | undefined;
  form: UseFormReturn<SupplyResourceRequestSchema>;
  onDepartmentIdChange: (departmentId: string) => void;
}

export default function SupplyItemsField({
  isPending,
  departments,
  categories,
  items,
  form,
  onDepartmentIdChange,
}: SupplyItemsFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<DepartmentWithRelations | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(
    null
  );
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const filteredItems = React.useMemo(() => {
    let filtered = items?.filter(
      (item) => item.departmentId === selectedDepartment?.id
    );
    if (categoryFilter) {
      filtered = filtered?.filter(
        (item) => item.category.id === categoryFilter
      );
    }
    return filtered;
  }, [items, selectedDepartment, categoryFilter]);

  const handleDepartmentSelect = (department: DepartmentWithRelations) => {
    setSelectedDepartment(department);
    setCategoryFilter(null);
    onDepartmentIdChange(department.id);
    form.setValue("items", []);
  };

  const handleItemSelect = (item: SupplyItemWithRelations) => {
    const currentItems = form.getValues("items") || [];
    const itemExists = currentItems.some((i) => i.supplyItemId === item.id);
    if (!itemExists) {
      form.setValue("items", [
        ...currentItems,
        { supplyItemId: item.id, quantity: 1 },
      ]);
    }
  };

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
    <FormField
      control={form.control}
      name="items"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Supply Items</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    field.value &&
                      field.value.length === 0 &&
                      "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  {field.value && field.value.length > 0
                    ? `${field.value.length} item${field.value.length > 1 ? "s" : ""} selected`
                    : "Select items"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Tabs defaultValue="select" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="select">Select Items</TabsTrigger>
                    <TabsTrigger value="selected" className="relative">
                      Selected Items
                      {field.value?.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {field.value.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="select" className="border-none p-0">
                    <Command className="max-h-[300px]">
                      <CommandInput
                        placeholder={
                          selectedDepartment
                            ? "Search items..."
                            : "Search departments..."
                        }
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {selectedDepartment ? (
                            <>
                              <CommandItem
                                onSelect={() => setSelectedDepartment(null)}
                              >
                                <ChevronRight className="mr-2 h-4 w-4" />
                                Back to departments
                              </CommandItem>
                              <CommandSeparator />
                              <div className="p-2">
                                <Popover
                                  open={categoryOpen}
                                  onOpenChange={setCategoryOpen}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={categoryOpen}
                                      className="w-full justify-between"
                                    >
                                      {categoryFilter
                                        ? categories?.find(
                                            (category) =>
                                              category.id === categoryFilter
                                          )?.name
                                        : "All categories"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[400px] p-0">
                                    <Command className="max-h-48">
                                      <CommandInput placeholder="Search categories..." />
                                      <CommandList>
                                        <CommandEmpty>
                                          No category found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          <CommandItem
                                            onSelect={() => {
                                              setCategoryFilter(null);
                                              setCategoryOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                categoryFilter === null
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            All categories
                                          </CommandItem>
                                          {categories?.map((category) => (
                                            <CommandItem
                                              key={category.id}
                                              onSelect={() => {
                                                setCategoryFilter(category.id);
                                                setCategoryOpen(false);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  categoryFilter === category.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              {category.name}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <CommandSeparator />
                              {filteredItems && filteredItems.length > 0 ? (
                                <>
                                  {filteredItems.map((item) => (
                                    <CommandItem
                                      key={item.id}
                                      onSelect={() => handleItemSelect(item)}
                                      className="flex items-center space-x-2"
                                    >
                                      <div className="relative h-10 w-10">
                                        <Image
                                          src={item.imageUrl}
                                          alt={item.name}
                                          layout="fill"
                                          objectFit="cover"
                                          className="rounded-md"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">
                                          {item.name}
                                        </p>
                                        <p className="line-clamp-2 text-xs leading-none text-muted-foreground">
                                          {item.description}
                                        </p>
                                      </div>
                                      <Badge variant="outline">
                                        {item.category.name}
                                      </Badge>
                                    </CommandItem>
                                  ))}
                                </>
                              ) : (
                                <p className="py-4 text-center text-muted-foreground">
                                  No items
                                </p>
                              )}
                            </>
                          ) : (
                            departments?.map((department) => (
                              <CommandItem
                                key={department.id}
                                onSelect={() =>
                                  handleDepartmentSelect(department)
                                }
                              >
                                {department.name}
                                <ChevronRight className="ml-auto h-4 w-4" />
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </TabsContent>
                  <TabsContent
                    value="selected"
                    className="scroll-bar max-h-[calc(80vh-200px)] space-y-1 overflow-auto p-1"
                  >
                    {field.value && field.value.length > 0 ? (
                      field.value.map((selectedItem) => {
                        const item = items?.find(
                          (i) => i.id === selectedItem.supplyItemId
                        );
                        if (!item) return null;

                        const status = getSupplyStatusColor(item.status);
                        return (
                          <Card key={item.id} className="bg-secondary">
                            <CardContent className="flex flex-col gap-3 p-3">
                              <div className="flex">
                                <div className="flex flex-1">
                                  <HoverCard closeDelay={0} openDelay={300}>
                                    <HoverCardTrigger asChild>
                                      <div className="relative mr-2 aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
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
                                      <h4 className="truncate text-lg font-semibold">
                                        {item.name}
                                      </h4>
                                      <p className="line-clamp-2 text-sm leading-none text-muted-foreground">
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
                                      onChange={(value) => {
                                        const newItems = field.value.map((i) =>
                                          i.supplyItemId === item.id
                                            ? { ...i, quantity: value }
                                            : i
                                        );
                                        form.setValue("items", newItems);
                                      }}
                                      className="w-fit"
                                    />
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost2"
                                        size="icon"
                                        onClick={() => {
                                          const newItems = field.value.filter(
                                            (i) => i.supplyItemId !== item.id
                                          );
                                          form.setValue("items", newItems);
                                        }}
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
                      <p className="py-4 text-center text-muted-foreground">
                        No items selected
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription>
            Select the supply items you need for your request from a single
            department.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
