"use client";

import React from "react";
import EditInput from "./edit-input";
import { useForm, useFormState, useWatch } from "react-hook-form";
import {
  addSupplyItem,
  AddsupplyItem,
  AddSupplyItemWithPath,
} from "@/lib/schema/resource/supply-resource";
import { zodResolver } from "@hookform/resolvers/zod";
import AddSupplyItem from "./add-supply-item";
import { SupplyRequestItemWithRelations } from "prisma/generated/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createSupplyItemRequest } from "@/lib/actions/resource";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { socket } from "@/app/socket";

interface AddSupplyItemWrapperProps {
  departmentId: string;
  supplyRequestId: string;
  setEditField: (value: string | null) => void;
  items: SupplyRequestItemWithRelations[];
}

export default function AddSupplyItemWrapper({
  items,
  departmentId,
  supplyRequestId,
  setEditField,
}: AddSupplyItemWrapperProps) {
  const pathname = usePathname();
  const form = useForm<AddsupplyItem>({
    resolver: zodResolver(addSupplyItem),
    defaultValues: {
      items: undefined,
      id: supplyRequestId,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const watchedItems = useWatch({ control: form.control, name: "items" });
  const isFieldsDirty =
    Object.keys(dirtyFields).length > 0 || !!watchedItems?.length;

  const { mutateAsync, isPending } = useServerActionMutation(
    createSupplyItemRequest
  );

  async function onSubmit(values: AddsupplyItem) {
    if (!departmentId) return;
    const data: AddSupplyItemWithPath = {
      ...values,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Adding...",
      success: () => {
        socket.emit("request_update");
        setEditField(null);
        return "The new item has been successfully added.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <EditInput
          isPending={isPending}
          isFieldsDirty={isFieldsDirty}
          setEditField={setEditField}
          label="Supply Items"
          reset={form.reset}
        >
          <AddSupplyItem
            departmentId={departmentId}
            items={items}
            form={form}
            mutateAsync={mutateAsync}
          />
        </EditInput>
      </form>
    </Form>
  );
}
