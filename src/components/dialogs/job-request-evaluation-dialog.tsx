"use client";

import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useMediaQuery } from "usehooks-ts";

interface JobRequestEvaluationSheetProps {
  jobRequestId: string;
  requestId: string;
}

export default function JobRequestEvaluationSheet({
  jobRequestId,
  requestId,
}: JobRequestEvaluationSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");

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


  return (
    <JobRequestEvaluationForm
      form={form}
      isPending={isPending}
      mutateAsync={mutateAsync}
      isFieldsDirty={isFieldsDirty}
      jobRequestId={jobRequestId}
      requestId={requestId}
    />
  );
}
