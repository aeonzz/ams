"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import type { SupplyItemType } from "@/lib/types/item";
import {
  updateInventorySubItemSchema,
  type UpdateInventorySubItemSchema,
} from "@/lib/db/schema/inventory-item";
import { updateInventorySubItem } from "@/lib/actions/inventoryItem";
import {
  updateSupplyItemSchema,
  type UpdateSupplyItemSchema,
} from "@/lib/db/schema/supply";
import type { ExtendedUpdateSupplyItemSchema } from "@/lib/schema/resource/supply-resource";
import { useSupplyItemCategory } from "@/lib/hooks/use-supply-item-category";
import { cn, isDateInPast } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { Textarea } from "@/components/ui/text-area";
import { useSupplyDepartments } from "@/lib/hooks/use-supply-departments";
import { updateSupplyItem } from "@/lib/actions/supply";
import { UnitTypeSchema } from "./create-supply-item-form";

interface UpdateSupplyItemSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  item: SupplyItemType;
  queryKey?: string[];
  removeField?: boolean;
}

export function UpdateSupplyItemSheet({
  item,
  queryKey,
  removeField = false,
  ...props
}: UpdateSupplyItemSheetProps) {
  const pathname = usePathname();
  const form = useForm<UpdateSupplyItemSchema>({
    resolver: zodResolver(updateSupplyItemSchema),
    defaultValues: {
      name: item.name,
      categoryId: item.categoryId,
      departmentId: item.departmentId,
      description: item.description ?? "",
      expirationDate: item.expirationDate ?? undefined,
      lowStockThreshold: item.lowStockThreshold,
      quantity: item.quantity,
      unit: item.unit,
      imageUrl: undefined,
    },
  });

  const { data, isLoading } = useSupplyDepartments();
  const { data: itemCategory, isLoading: isLoadingItemCategory } =
    useSupplyItemCategory();

  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateSupplyItem);
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  React.useEffect(() => {
    form.reset({
      name: item.name,
      categoryId: item.categoryId,
      departmentId: item.departmentId,
      description: item.description ?? "",
      expirationDate: item.expirationDate ?? undefined,
      lowStockThreshold: item.lowStockThreshold,
      quantity: item.quantity,
      unit: item.unit,
      imageUrl: undefined,
    });
  }, [item, form, props.open]);

  async function onSubmit(values: UpdateInventorySubItemSchema) {
    const { imageUrl, ...rest } = values;
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      if (values.imageUrl && values.imageUrl.length > 0) {
        uploadedFilesResult = await uploadFiles(values.imageUrl);
      }

      const data: ExtendedUpdateSupplyItemSchema = {
        ...rest,
        id: item.id,
        path: pathname,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Loading...",
        success: () => {
          props.onOpenChange?.(false);
          return "Item updated succesfully.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  }

  return (
    <Sheet {...props}>
      <SheetContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Update item</SheetTitle>
          <SheetDescription>
            Update the item details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Pen"
                        disabled={isPending || isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!removeField && (
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Department</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={
                                isUploading ||
                                isPending ||
                                isLoadingItemCategory ||
                                isLoading
                              }
                              role="combobox"
                              className={cn(
                                "w-full flex-1 justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <p className="truncate">
                                  {
                                    data?.find(
                                      (department) =>
                                        department.id === field.value
                                    )?.name
                                  }
                                </p>
                              ) : (
                                "Select managing department"
                              )}
                              {isLoading || isLoadingItemCategory ? (
                                <LoadingSpinner />
                              ) : (
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command className="max-h-72">
                            <CommandInput placeholder="Search department..." />
                            <CommandList>
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup>
                                {data?.map((department, index) => (
                                  <CommandItem
                                    value={department.id}
                                    key={index}
                                    onSelect={() => {
                                      field.onChange(department.id);
                                    }}
                                  >
                                    {department.name}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        department.id === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="number"
                          placeholder="1"
                          disabled={isPending || isUploading}
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value.slice(0, 3);
                            const numericValue = Number(value);
                            field.onChange(
                              isNaN(numericValue) ? 0 : numericValue
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Low Stock Threshhold</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="number"
                          placeholder="1"
                          disabled={isPending || isUploading}
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value.slice(0, 3);
                            const numericValue = Number(value);
                            field.onChange(
                              isNaN(numericValue) ? 0 : numericValue
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Unit</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isUploading || isPending}
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">
                                {field.value ? field.value : "Select unit type"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[230px] p-0" align="start">
                          <Command className="max-h-72">
                            <CommandInput placeholder="Search unit..." />
                            <CommandList>
                              <CommandEmpty>No unit found.</CommandEmpty>
                              <CommandGroup>
                                {UnitTypeSchema.map((unit, index) => (
                                  <CommandItem
                                    value={unit}
                                    key={index}
                                    onSelect={() => {
                                      field.onChange(unit);
                                    }}
                                  >
                                    {unit}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        unit === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Item Category</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={
                                isUploading ||
                                isPending ||
                                isLoadingItemCategory
                              }
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? itemCategory?.find(
                                      (item) => item.id === field.value
                                    )?.name
                                  : "Select category"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[230px] p-0" align="start">
                          <Command className="max-h-72">
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {itemCategory?.map((category) => (
                                  <CommandItem
                                    value={category.id}
                                    key={category.id}
                                    onSelect={() => {
                                      field.onChange(category.id);
                                    }}
                                  >
                                    {category.name}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        category.id === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>
                      Expiration Date{" "}
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start px-2 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isUploading || isPending}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="5">In 5 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                            <SelectItem value="30">In a month</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isDateInPast}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={5}
                        placeholder="description..."
                        className="min-h-[100px] flex-grow resize-none bg-transparent text-sm"
                        disabled={isPending || isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Inventory image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isPending || isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Separator className="my-2" />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending || isUploading}
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  disabled={
                    Object.keys(dirtyFields).length === 0 ||
                    isPending ||
                    isUploading
                  }
                  type="submit"
                  className="w-20"
                >
                  Save
                </Button>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
