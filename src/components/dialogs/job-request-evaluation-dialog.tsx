"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { CircleHelp, Info, X } from "lucide-react";
import JobRequestEvaluationForm, {
  questionKeys,
} from "@/components/forms/job-request-evaluation-form";
import {
  createJobEvaluationSchema,
  CreateJobEvaluationSchema,
} from "@/lib/schema/evaluation/job";
import { createJobRequestEvaluation } from "@/lib/actions/evaluation";
import { P } from "../typography/text";

interface JobRequestEvaluationDialogProps {
  children: React.ReactNode;
  jobRequestId: string;
  requestId: string;
}

export default function JobRequestEvaluationDialog({
  children,
  jobRequestId,
  requestId,
}: JobRequestEvaluationDialogProps) {
  const dialogManager = useDialogManager();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const form = useForm<CreateJobEvaluationSchema>({
    resolver: zodResolver(createJobEvaluationSchema),
    defaultValues: {
      clientType: undefined,
      age: undefined,
      regionOfResidence: "",
      position: "",
      otherPosition: "",
      sex: "",
      awarenessLevel: "",
      visibility: "",
      helpfulness: "",
      suggestions: "",
      surveyResponses: Object.fromEntries(questionKeys.map((key) => [key, ""])),
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(
    createJobRequestEvaluation
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  React.useEffect(() => {
    form.reset();
  }, [dialogManager.activeDialog]);

  return (
    <>
      <Dialog
        open={dialogManager.activeDialog === "jobRequestEvaluationDialog"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent
          onInteractOutside={(e) => {
            if (isPending) {
              e.preventDefault();
            }
            if (isFieldsDirty && !isPending) {
              e.preventDefault();
              setAlertOpen(true);
            }
          }}
          isLoading={isPending}
          className="max-w-4xl"
        >
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            {isFieldsDirty && !isPending && (
              <AlertDialogTrigger disabled={isPending} asChild>
                <button
                  disabled={isPending}
                  className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
            )}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to leave?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    dialogManager.setActiveDialog(null);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DialogHeader className="flex-row items-center gap-2 space-y-0">
            <DialogTitle>Job Evaluation</DialogTitle>
            <HoverCard openDelay={100} closeDelay={0}>
              <HoverCardTrigger asChild>
                <CircleHelp className="size-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
              </HoverCardTrigger>
              <HoverCardContent className="w-[555px]">
                <div className="flex">
                  <div className="mr-2 w-fit">
                    <Info className="size-4 text-primary" />
                  </div>
                  <P className="text-muted-foreground">
                    This{" "}
                    <span className="font-semibold text-primary">
                      Client Satisfaction Measurement (CSM)
                    </span>{" "}
                    tracks the customer experience of government offices. Your
                    feedback on your{" "}
                    <span className="underline">
                      recently concluded transaction
                    </span>{" "}
                    will help this office provide a better service. Personal
                    information shared will be kept confidential and you always
                    have option to not answer this form.
                  </P>
                </div>
              </HoverCardContent>
            </HoverCard>
          </DialogHeader>
          <JobRequestEvaluationForm
            form={form}
            isPending={isPending}
            mutateAsync={mutateAsync}
            handleOpenChange={handleOpenChange}
            isFieldsDirty={isFieldsDirty}
            jobRequestId={jobRequestId}
            requestId={requestId}
          />
        </DialogContent>
      </Dialog>
      {children}
    </>
  );
}
