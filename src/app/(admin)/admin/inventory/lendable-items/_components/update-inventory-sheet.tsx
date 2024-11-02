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
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import {
  updateInventoryItemSchema,
  type UpdateInventoryItemSchema,
} from "@/lib/db/schema/inventory";
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
import { Textarea } from "@/components/ui/text-area";
import { type InventoryItemType } from "@/lib/types/item";
import { updateInventory } from "@/lib/actions/inventory";
import { ExtendedUpdateInventoryItemServerSchema } from "@/lib/schema/resource/returnable-resource";
import { useLendableDepartments } from "@/lib/hooks/use-lendable-departments";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { Check, ChevronsUpDown } from "lucide-react";

interface UpdateInventoryProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  inventory: InventoryItemType;
  queryKey?: string[];
  removeField?: boolean;
}

export function UpdateInventorySheet({
  inventory,
  queryKey,
  removeField = false,
  ...props
}: UpdateInventoryProps) {
  const pathname = usePathname();
  const form = useForm<UpdateInventoryItemSchema>({
    resolver: zodResolver(updateInventoryItemSchema),
    defaultValues: {
      name: inventory.name,
      description: inventory.description,
      imageUrl: undefined,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });

  const { data, isLoading } = useLendableDepartments();

  const { isPending, mutateAsync } = useServerActionMutation(updateInventory);
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  React.useEffect(() => {
    form.reset({
      name: inventory.name,
      description: inventory.description,
      imageUrl: undefined,
    });
  }, [inventory, form, props.open]);

  async function onSubmit(values: UpdateInventoryItemSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      if (values.imageUrl && values.imageUrl.length > 0) {
        uploadedFilesResult = await uploadFiles(values.imageUrl);
      }

      const data: ExtendedUpdateInventoryItemServerSchema = {
        id: inventory.id,
        path: pathname,
        name: values.name,
        description: values.description,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Updating...",
        success: () => {
          props.onOpenChange?.(false);
          return "Equipment updated succesfully.";
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
          <SheetTitle>Update equipment</SheetTitle>
          <SheetDescription>
            Update the equipment details and save the changes
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
                        placeholder="Campus Shuttle"
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
                              disabled={isUploading || isPending || isLoading}
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
                              {isLoading ? (
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
                        placeholder="Description"
                        className="min-h-[100px] flex-grow resize-none bg-transparent text-sm"
                        disabled={isPending}
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
                    <FormLabel>Equipment image</FormLabel>
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
