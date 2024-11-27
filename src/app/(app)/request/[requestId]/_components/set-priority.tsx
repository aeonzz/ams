"use client";

import PriorityOption, {
  priorities,
  Priority,
} from "@/app/(app)/dashboard/_components/priority-option";
import { PriorityTypeType } from "prisma/generated/zod/inputTypeSchemas/PriorityTypeSchema";
import { Minus } from "lucide-react";
import React from "react";
import { P } from "@/components/typography/text";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateJobRequest } from "@/lib/actions/job";
import { toast } from "sonner";
import type { UpdateJobRequestSchemaServerWithPath } from "@/lib/schema/request";
import { usePathname } from "next/navigation";

interface SetPriorityProps {
  prio: PriorityTypeType;
	requestId: string;
}

export default function SetPriority({ prio, requestId }: SetPriorityProps) {
	const pathname = usePathname()
  const initialPriority =
    priorities.find((priority) => priority.value === prio) || priorities[0];

  const [priority, setPriority] = React.useState<Priority>(initialPriority);

	
  const { mutateAsync, isPending } = useServerActionMutation(updateJobRequest);

	
  async function onSubmit() {
    try {
      const data: UpdateJobRequestSchemaServerWithPath = {
        path: pathname,
        id: requestId,
        ...values,
      };

      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          form.reset({
            jobType: data.jobType,
            location: data.location,
            description: data.description,
            dueDate: data.dueDate,
          });
          setEditField(null);
          return "Request updated successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  }

  return (
    <div>
      <P className="mb-1 text-sm">Priority</P>
      <PriorityOption prio={priority} setPrio={setPriority} isLoading={false} />
    </div>
  );
}
