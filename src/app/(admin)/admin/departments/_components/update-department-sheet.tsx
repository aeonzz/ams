"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  DepartmentTypeSchema,
  type DepartmentWithRelations,
} from "prisma/generated/zod";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  updateDepartmentSchema,
  UpdateDepartmentSchema,
} from "@/lib/schema/department";
import { updateDepartment } from "@/lib/actions/department";
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
import { Textarea } from "@/components/ui/text-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import type { DepartmentsTableType } from "./types";

interface UpdateDepartmentSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  department: DepartmentsTableType;
  queryKey?: string[];
  removeField?: boolean;
}

export function UpdateDepartmentSheet({
  department,
  queryKey,
  removeField = false,
  ...props
}: UpdateDepartmentSheetProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const form = useForm<UpdateDepartmentSchema>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: department.name,
      acceptsJobs: department.acceptsJobs,
      departmentType: department.departmentType,
      description: department.description ?? "",
      responsibilities: department.responsibilities ?? "",
      managesTransport: department.managesTransport,
      managesBorrowRequest: department.managesBorrowRequest,
      managesFacility: department.managesFacility,
      managesSupplyRequest: department.managesSupplyRequest,
      path: pathname,
      departmentId: department.id,
    },
  });
  const departmentType = form.watch("departmentType");

  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateDepartment);

  React.useEffect(() => {
    form.reset({
      name: department.name,
      acceptsJobs: department.acceptsJobs,
      departmentType: department.departmentType,
      description: department.description ?? "",
      responsibilities: department.responsibilities ?? "",
      managesTransport: department.managesTransport,
      managesBorrowRequest: department.managesBorrowRequest,
      managesFacility: department.managesFacility,
      managesSupplyRequest: department.managesSupplyRequest,
      path: pathname,
      departmentId: department.id,
    });
  }, [department, form, props.open]);

  function onSubmit(values: UpdateDepartmentSchema) {
    const data: UpdateDepartmentSchema = {
      ...values,
    };

    toast.promise(mutateAsync(data), {
      loading: "Saving...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: queryKey,
        });
        props.onOpenChange?.(false);
        return "Department updated successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong, please try again later.";
      },
    });
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
          <SheetTitle>Update department</SheetTitle>
          <SheetDescription>
            Update the department details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4 pb-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Information Technology"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Description..."
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={10}
                        placeholder="responsibilities..."
                        className="min-h-[100px] flex-grow resize-none bg-transparent"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="departmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Type</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? textTransform(
                                  DepartmentTypeSchema.options.find(
                                    (option) => option === field.value
                                  ) || "Select department type"
                                )
                              : "Select department type"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search department type..." />
                          <CommandList>
                            <CommandEmpty>
                              No department type found.
                            </CommandEmpty>
                            <CommandGroup>
                              {DepartmentTypeSchema.options.map((option) => (
                                <CommandItem
                                  key={option}
                                  onSelect={() => {
                                    field.onChange(
                                      option === field.value ? "" : option
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === option
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {textTransform(option)}
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
              {departmentType === "ACADEMIC" ? (
                <>
                  <FormField
                    control={form.control}
                    name="acceptsJobs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Accept Jobs</FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department can handle job
                            requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("acceptsJobs") && (
                    <Card className="space-y-3 bg-secondary p-3">
                      <FormField
                        control={form.control}
                        name="responsibilities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsibilities</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={1}
                                maxRows={10}
                                placeholder="responsibilities..."
                                className="min-h-[100px] flex-grow resize-none text-sm"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  )}
                  <FormField
                    control={form.control}
                    name="managesBorrowRequest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Borrow Request Management
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department manages or handles
                            borrow requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="managesFacility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Facility Management
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department manages or handles
                            facilities.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="acceptsJobs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Accept Jobs</FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department can handle job
                            requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("acceptsJobs") && (
                    <Card className="space-y-3 bg-secondary p-3">
                      <FormField
                        control={form.control}
                        name="responsibilities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsibilities</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={1}
                                maxRows={10}
                                placeholder="responsibilities..."
                                className="min-h-[100px] flex-grow resize-none text-sm"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  )}
                  <FormField
                    control={form.control}
                    name="managesTransport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Transport Services
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department offers or manages
                            transport services.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="managesSupplyRequest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Supply Request Management
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department manages or handles
                            supply requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="managesFacility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Facility Management
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Indicates whether this department manages or handles
                            facilities.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div>
              <Separator className="my-2" />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  disabled={Object.keys(dirtyFields).length === 0 || isPending}
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
