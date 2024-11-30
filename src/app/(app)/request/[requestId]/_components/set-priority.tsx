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
import { Button } from "@/components/ui/button";
import { checkPermission, cn } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";

interface SetPriorityProps {
  prio: PriorityTypeType;
  requestId: string;
  disabled: boolean;
  allowedDepartment: string;
}

export default function SetPriority({
  prio,
  requestId,
  disabled,
  allowedDepartment,
}: SetPriorityProps) {
  const currentUser = useSession();
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

  const hasAccess = checkPermission({
    currentUser,
    allowedRoles: ["OPERATIONS_MANAGER"],
    allowedDepartment: allowedDepartment,
  });

  function handlePriorityChange(newPriority: Priority) {
    setPriority(newPriority);
    onSubmit(newPriority);
  }

  return (
    <div>
      <P className="mb-1 text-sm">Priority</P>
      {hasAccess ? (
        <PriorityOption
          prio={priority}
          setPrio={handlePriorityChange}
          isLoading={isPending || disabled}
        />
      ) : (
        <Button
          variant="ghost2"
          size="sm"
          role="combobox"
          className={cn(
            priority.value === "NO_PRIORITY" && "text-muted-foreground",
            "w-48 justify-start px-2"
          )}
        >
          {prio ? (
            <>
              <priority.icon
                className={cn(
                  "mr-2 size-4",
                  priority.value === "URGENT" && "text-amber-500"
                )}
              />
              {priority.label}
            </>
          ) : (
            <>Priority</>
          )}
        </Button>
      )}
    </div>
  );
}
