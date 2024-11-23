"use client";

import React from "react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/text-area";
import {
  createMaintenanceRecordSchema,
  CreateMaintenanceRecordSchemaWithPath,
  type CreateMaintenanceRecordSchema,
} from "./schema";
import { createMaintenanceHistory } from "@/lib/actions/maintenance-history";
import NumberInput from "@/components/number-input";
import { Separator } from "@/components/ui/separator";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MaintenanceDialogProps {
  vehicleId: string;
  initialOdometer: number;
}

export default function MaintenanceDialog({
  vehicleId,
  initialOdometer,
}: MaintenanceDialogProps) {
  const form = useForm<CreateMaintenanceRecordSchema>({
    resolver: zodResolver(createMaintenanceRecordSchema),
    defaultValues: {
      description: "",
      odometer: initialOdometer,
    },
  });
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(
    createMaintenanceHistory
  );

  async function onSubmit(values: CreateMaintenanceRecordSchema) {
    if (values.odometer === initialOdometer) {
      toast.error("Please enter the actual odometer reading.");
      return;
    }

    const data: CreateMaintenanceRecordSchemaWithPath = {
      path: pathname,
      description: values.description,
      odometer: values.odometer,
      vehicleId: vehicleId,
      performedAt: values.performedAt,
    };

    toast.promise(mutateAsync(data), {
      loading: "Loading...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["vehicle-details", vehicleId],
        });
        setOpen(false);
        return "Maintenance record created successfully!";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  React.useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending} className="flex-1" variant="outline">
          Complete Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log Maintenance Record</DialogTitle>
          <DialogDescription>
            Enter the details for this maintenance activity. Ensure the odometer
            reading is accurate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3 px-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        maxRows={6}
                        minRows={3}
                        placeholder="Description..."
                        className="bg-transparent text-sm shadow-none placeholder:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="performedAt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Repair Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="odometer"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Actual Odometer Reading</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        min={0}
                        disabled={isPending}
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
            </div>
            <Separator className="my-4" />
            <DialogFooter>
              <Button
                disabled={isPending}
                variant="outline"
                onClick={(e) => {
                  e.preventDefault(), setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !isFieldsDirty}>
                Create Record
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
