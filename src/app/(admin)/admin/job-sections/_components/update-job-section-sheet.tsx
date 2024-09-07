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
import { Textarea } from "@/components/ui/text-area";
import { type Section } from "prisma/generated/zod";
import {
  updateJobSectionSchema,
  type UpdateJobSectionSchema,
  type UpdateJobSectionSchemaWithPath,
} from "@/lib/schema/job-section";
import { updateJobSection } from "@/lib/actions/job-section";

interface UpdateJobSectionSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  jobSection: Section;
}

export function UpdateJobSectionSheet({
  jobSection,
  ...props
}: UpdateJobSectionSheetProps) {
  const pathname = usePathname();
  const form = useForm<UpdateJobSectionSchema>({
    resolver: zodResolver(updateJobSectionSchema),
    defaultValues: {
      name: jobSection.name,
      description: jobSection.description ? jobSection.description : "",
    },
  });
  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateJobSection);

  React.useEffect(() => {
    form.reset({
      name: jobSection.name,
      description: jobSection.description ? jobSection.description : "",
    });
  }, [jobSection, form, props.open]);

  async function onSubmit(values: UpdateJobSectionSchema) {
    const data: UpdateJobSectionSchemaWithPath = {
      id: jobSection.id,
      path: pathname,
      name: values.name,
      description: values.description || "",
    };

    toast.promise(mutateAsync(data), {
      loading: "Updating...",
      success: () => {
        props.onOpenChange?.(false);
        return "Job section updated succesfully.";
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
          <SheetTitle>Update job section</SheetTitle>
          <SheetDescription>
            Update the section details and save the changes
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
                        placeholder="Mechanical"
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
