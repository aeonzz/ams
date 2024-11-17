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
  type Department,
  VehicleStatusSchema,
  type Vehicle,
} from "prisma/generated/zod";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { updateVehicle } from "@/lib/actions/vehicle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getVehicleStatusColor, textTransform } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  updateVehicleSchema,
  type UpdateVehicleSchema,
} from "@/lib/db/schema/vehicle";
import { ExtendedUpdateVehicleServerSchema } from "@/lib/schema/vehicle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDown, Dot } from "lucide-react";
import { UpdateVehicleSheetSkeleton } from "./update-vehicle-sheet-skeleton";
import NumberInput from "@/components/number-input";
import { useTransportDepartments } from "@/lib/hooks/use-transport-depratments";

interface UpdateVehicleProps extends React.ComponentPropsWithRef<typeof Sheet> {
  vehicle: Vehicle;
  queryKey?: string[];
  removeField?: boolean;
}

export function UpdateVehicleSheet({
  vehicle,
  queryKey,
  removeField = false,
  ...props
}: UpdateVehicleProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const form = useForm<UpdateVehicleSchema>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: {
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      departmentId: vehicle.departmentId,
      imageUrl: undefined,
    },
  });

  const { data, isLoading } = useTransportDepartments();
  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateVehicle);
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  React.useEffect(() => {
    form.reset({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      departmentId: vehicle.departmentId,
      imageUrl: undefined,
    });
  }, [vehicle, form, props.open]);

  async function onSubmit(values: UpdateVehicleSchema) {
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        if (values.imageUrl && values.imageUrl.length > 0) {
          currentFiles = await onUpload(values.imageUrl);
        }

        const data: ExtendedUpdateVehicleServerSchema = {
          id: vehicle.id,
          path: pathname,
          name: values.name,
          type: values.type,
          departmentId: values.departmentId,
          capacity: values.capacity,
          odometer: values.odometer,
          licensePlate: values.licensePlate,
          status: values.status,
          imageUrl: currentFiles.map((result) => result.url),
        };

        await mutateAsync(data);
      };

      toast.promise(uploadAndSubmit(), {
        loading: "Updating...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
          props.onOpenChange?.(false);
          return "Vehicle updated succesfully.";
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
          <SheetTitle>Update vehicle</SheetTitle>
          <SheetDescription>
            Update the vehicle details and save the changes
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <UpdateVehicleSheetSkeleton />
        ) : (
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
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="e.g., Bus, Van, Car"
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
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate No.</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="ABC 1234"
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
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          min={0}
                          max={100}
                          disabled={isPending || isUploading}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          className="w-full justify-between"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="odometer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>odometer</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={field.value}
                          min={0}
                          disabled={isPending || isUploading}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          className="w-full justify-between"
                          isDecimal={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-transparent capitalize"
                            disabled={isPending || isUploading}
                          >
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-secondary">
                          <SelectGroup>
                            {VehicleStatusSchema.options.map((option) => {
                              const status = getVehicleStatusColor(option);
                              return (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="capitalize"
                                >
                                  <Badge
                                    variant={status.variant}
                                    className="pr-3.5"
                                  >
                                    <Dot
                                      className="mr-1 size-3"
                                      strokeWidth={status.stroke}
                                      color={status.color}
                                    />
                                    {textTransform(option)}
                                  </Badge>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                        <FormLabel>Assign Managing Department</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={isLoading || isPending}
                                className="w-full justify-between text-muted-foreground"
                              >
                                {field.value
                                  ? data?.find(
                                      (department) =>
                                        department.id === field.value
                                    )?.name
                                  : "Select a department to manage"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Search department..." />
                              <CommandList>
                                <CommandEmpty>
                                  {isLoading
                                    ? "Loading..."
                                    : "No department found."}
                                </CommandEmpty>
                                <CommandGroup>
                                  <div className="scroll-bar max-h-40 overflow-y-auto">
                                    {data?.map((department) => (
                                      <CommandItem
                                        value={department.name}
                                        key={department.id}
                                        onSelect={() => {
                                          field.onChange(
                                            department.id === field.value
                                              ? ""
                                              : department.id
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === department.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {department.name}
                                      </CommandItem>
                                    ))}
                                  </div>
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
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Vehicle image</FormLabel>
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
        )}
      </SheetContent>
    </Sheet>
  );
}
