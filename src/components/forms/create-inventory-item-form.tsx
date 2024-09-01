"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { DialogFooter } from "../ui/dialog";
import { SubmitButton } from "../ui/submit-button";
import { type UseMutateAsyncFunction } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { useParams, usePathname } from "next/navigation";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { type CreateInventoryItemSchema } from "@/lib/db/schema/inventory-item";
import { createInventorySubItem } from "@/lib/actions/inventoryItem";
import { CreateInventorySubItemtSchemaWithPath } from "@/lib/schema/resource/returnable-resource";

interface CreateInventoryFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createInventorySubItem>[0],
    unknown
  >;
  form: UseFormReturn<CreateInventoryItemSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
}

export default function CreateInventoryItemForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
}: CreateInventoryFormProps) {
  const pathname = usePathname();
  const params = useParams();
  const inventoryItemId = params.inventoryItemId;

  async function onSubmit(values: CreateInventoryItemSchema) {
    const data: CreateInventorySubItemtSchemaWithPath = {
      path: pathname,
      inventoryId: inventoryItemId as string,
    };

    toast.promise(mutateAsync(data), {
      loading: "Submitting...",
      success: () => {
        dialogManager.setActiveDialog(null);
        return "InventoryItem created successfuly";
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
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="returnableItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Projector"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  dialogManager.setActiveDialog(null);
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
