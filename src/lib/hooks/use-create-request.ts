import * as React from "react";
import { useServerActionMutation } from "./server-action-hooks";
import { createRequest } from "../actions/request";
import { useDialog } from "./use-dialog";
import { toast } from "sonner";

export function useCreateRequest() {
  const dialog = useDialog();

  const { isPending, mutate } = useServerActionMutation(createRequest, {
    onSuccess: () => {
      dialog.setActiveDialog("");
      toast.success("Request Successful!", {
        description:
          "Your request has been submitted and is awaiting approval.",
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

  return { isPending, mutate };
}
