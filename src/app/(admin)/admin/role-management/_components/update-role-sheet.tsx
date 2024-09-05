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
import type { RoleType } from "@/lib/types/role";
import {
  updateRoleSchema,
  type UpdateRoleSchemaWithPath,
  type UpdateRoleSchema,
} from "@/lib/schema/role";
import { Textarea } from "@/components/ui/text-area";
import { updateRole } from "@/lib/actions/role";

interface UpdateDeparRoleProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  role: RoleType;
}

export function UpdateRoleSheet({ role, ...props }: UpdateDeparRoleProps) {
  const pathname = usePathname();
  const form = useForm<UpdateRoleSchema>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description ? role.description : "",
    },
  });
  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateRole);

  React.useEffect(() => {
    form.reset({
      name: role.name,
      description: role.description ? role.description : "",
    });
  }, [role, form, props.open]);

  async function onSubmit(values: UpdateRoleSchema) {
    const data: UpdateRoleSchemaWithPath = {
      id: role.id,
      path: pathname,
      name: values.name,
      description: values.description || "",
    };

    toast.promise(mutateAsync(data), {
      loading: "Updating...",
      success: () => {
        props.onOpenChange?.(false);
        return "Role updated succesfully.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
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
          <SheetTitle>Update role</SheetTitle>
          <SheetDescription>
            Update the role details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4 py-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Admin"
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
                        maxRows={5}
                        placeholder="description..."
                        className="min-h-[100px] flex-grow resize-none"
                        disabled={isPending}
                        {...field}
                        value={field.value ?? ""}
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
