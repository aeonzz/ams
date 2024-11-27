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
import { toast } from "sonner";
import type { UpdateJobRequestSchemaServerWithPath } from "@/lib/schema/request";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateJobRequest } from "@/lib/actions/requests";

interface SetPriorityProps {
  prio: PriorityTypeType;
  requestId: string;
  disabled: boolean;
}

export default function SetPriority({
  prio,
  requestId,
  disabled,
}: SetPriorityProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const initialPriority =
    priorities.find((priority) => priority.value === prio) || priorities[0];

  const [priority, setPriority] = React.useState<Priority>(initialPriority);

  const { mutateAsync, isPending } = useServerActionMutation(updateJobRequest);

  async function onSubmit(updatedPriority: Priority) {
    try {
      const data: UpdateJobRequestSchemaServerWithPath = {
        path: pathname,
        id: requestId,
        priority: updatedPriority.value,
      };

      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          return "Saved";
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

  function handlePriorityChange(newPriority: Priority) {
    setPriority(newPriority);
    onSubmit(newPriority);
  }

  return (
    <div>
      <P className="mb-1 text-sm">Priority</P>
      <PriorityOption
        prio={priority}
        setPrio={handlePriorityChange}
        isLoading={isPending || disabled}
      />
    </div>
  );
}
