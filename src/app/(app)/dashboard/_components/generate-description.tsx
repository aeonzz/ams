"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { generateResponseText } from "@/lib/actions/ai";
import { UseFormReturn } from "react-hook-form";
import { CreateJobRequestSchema } from "./schema";
import { Textarea } from "@/components/ui/text-area";

export default function GenerateDescription({
  form,
}: {
  form: UseFormReturn<CreateJobRequestSchema>;
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const department = form.getValues("departmentId");
    const location = form.getValues("location");
    const dueDate = form.getValues("dueDate");
    const jobType = form.getValues("jobtype");

    const prompt = `Generate a brief job description for a ${jobType} job in the ${department} department, located at ${location}, due by ${dueDate}.`;

    try {
      const result = await generateResponseText(prompt);
      if (result.success) {
        form.setValue("description", result.text);
      } else {
        console.error("Error generating description:", result.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Error generating description:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                rows={1}
                maxRows={7}
                minRows={3}
                placeholder="Job description..."
                className="border-none p-0 focus-visible:ring-0"
                disabled={isGenerating || form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        onClick={handleGenerateDescription}
        disabled={isGenerating || form.formState.isSubmitting}
        type="button"
      >
        {isGenerating ? "Generating..." : "Generate AI Description"}
      </Button>
    </div>
  );
}
