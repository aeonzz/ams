"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Separator } from "../../../../../components/ui/separator";
import { DialogFooter } from "../../../../../components/ui/dialog";
import { SubmitButton } from "../../../../../components/ui/submit-button";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { createDepartment } from "@/lib/actions/department";
import { CreateDepartmentSchema } from "@/lib/schema/department";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/text-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DepartmentTypeSchema } from "prisma/generated/zod";
import { cn, textTransform } from "@/lib/utils";

interface CreateDepartmentFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createDepartment>[0],
    unknown
  >;
  form: UseFormReturn<CreateDepartmentSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
}

export default function CreateDepartmentForm({
  setIsOpen,
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
}: CreateDepartmentFormProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  async function onSubmit(values: CreateDepartmentSchema) {
    const data = {
      ...values,
    };

    toast.promise(mutateAsync(data), {
      loading: "Creating...",
      success: () => {
        setIsOpen(false);
        return "Department created successfully";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
          <div className="flex flex-1 flex-col space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                    <Textarea
                      rows={1}
                      maxRows={10}
                      placeholder="Description..."
                      className="min-h-[100px] flex-grow resize-none text-sm"
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
                      className="min-h-[100px] flex-grow resize-none"
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
                          <CommandEmpty>No department type found.</CommandEmpty>
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
            <FormField
              control={form.control}
              name="acceptsJobs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Accept Jobs</FormLabel>
                    <FormDescription className="text-xs">
                      Indicates whether this department can handle job requests.
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
            {form.watch("managesBorrowRequest") && (
              <>
                <FormField
                  control={form.control}
                  name="maxBorrowDuration"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Borrow Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Borrow Duration"
                          autoComplete="off"
                          {...field}
                          min={0}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (parseInt(value, 10) >= 0 &&
                                parseInt(value, 10) <= 99)
                            ) {
                              field.onChange(parseInt(e.target.value, 10));
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gracePeriod"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Grace Period (Hours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Period"
                          autoComplete="off"
                          {...field}
                          min={0}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (parseInt(value, 10) >= 0 &&
                                parseInt(value, 10) <= 99)
                            ) {
                              field.onChange(parseInt(e.target.value, 10));
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="penaltyBorrowBanDuration"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Penalty Borrow Ban Duration (Hours){" "}
                        <span className="text-xs text-muted-foreground">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ban Duration"
                          autoComplete="off"
                          {...field}
                          min={0}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (parseInt(value, 10) >= 0 &&
                                parseInt(value, 10) <= 99)
                            ) {
                              field.onChange(parseInt(e.target.value, 10));
                            }
                          }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Other Info.{" "}
                        <span className="text-xs text-muted-foreground">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={1}
                          maxRows={10}
                          placeholder="Info..."
                          className="min-h-[100px] flex-grow resize-none text-sm"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
          </div>
        </div>
        <Separator className="my-4" />
        <DialogFooter>
          <div></div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                if (isFieldsDirty) {
                  setAlertOpen(true);
                } else {
                  setIsOpen(false);
                }
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <SubmitButton disabled={isPending} type="submit" className="w-20">
              Create
            </SubmitButton>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
