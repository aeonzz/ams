"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/text-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { createJobRequestEvaluation } from "@/lib/actions/evaluation";
import { UseFormReturn } from "react-hook-form";
import { type CreateJobEvaluationSchema } from "@/lib/schema/evaluation/job";
import { Separator } from "../ui/separator";
import { DialogFooter } from "../ui/dialog";
import { SubmitButton } from "../ui/submit-button";
import { ClientTypeSchema } from "prisma/generated/zod";
import { ClientTypeType } from "prisma/generated/zod/inputTypeSchemas/ClientTypeSchema";
import { P } from "../typography/text";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const surveyQuestions = [
  "SQ0: I am satisfied with the service that I availed.",
  "SQ1: I spent a reasonable amount of time on my transaction.",
  "SQ2: The office followed the transaction's requirements and steps based on the information provided.",
  "SQ3: The steps (including payment) I needed to do for my transaction were easy and simple.",
  "SQ4: I easily found information about my transaction from the office or its website.",
  "SQ5: I paid a reasonable amount of fees for my transaction.",
  `SQ6: I feel the office was fair to everyone, or "walang palakasan", during my transaction.`,
  "SQ7: I was treated courteously by the staff and (if asked for help) the staff was helpful.",
  "SQ8: I got what I needed from the government office, or (if denied) denial of the request was successfully explained to me.",
] as const;

export const questionKeys = [
  "SQ0",
  "SQ1",
  "SQ2",
  "SQ3",
  "SQ4",
  "SQ5",
  "SQ6",
  "SQ7",
  "SQ8",
] as const;

const emojiRatings = ["😡", "😠", "😐", "🙂", "😃", "N/A"] as const;
const emojiMeanings = [
  {
    label: "Strongly Disagree",
    value: "Strongly_Disagree",
  },
  {
    label: "Disagree",
    value: "Disagree",
  },
  {
    label: "Neither Agree nor Disagree",
    value: "Neither_Agree_Nor_Disagree",
  },
  {
    label: "Agree",
    value: "Agree",
  },
  {
    label: "Strongly Agree",
    value: "Strongly_Agree",
  },
  {
    label: "Not Applicable",
    value: "Not_Applicable",
  },
];

interface JobRequestEvaluationFormProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createJobRequestEvaluation>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<CreateJobEvaluationSchema>;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
  jobRequestId: string;
  requestId: string;
}

export default function JobRequestEvaluationForm({
  mutateAsync,
  isPending,
  form,
  handleOpenChange,
  isFieldsDirty,
  jobRequestId,
  requestId,
}: JobRequestEvaluationFormProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const onSubmit = async (values: CreateJobEvaluationSchema) => {
    try {
      const data = {
        ...values,
        jobRequestId: jobRequestId,
        path: pathname,
      };
      toast.promise(mutateAsync(data), {
        loading: "Submitting your evaluation...",
        success: () => {
          handleOpenChange(false);
          return "Thank you! Your evaluation has been successfully submitted.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  };

  const awarenessLevel = form.watch("awarenessLevel");
  const showAdditionalQuestions = awarenessLevel !== "not_aware";

  React.useEffect(() => {
    if (!showAdditionalQuestions) {
      form.setValue("visibility", "N/A", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      form.setValue("helpfulness", "N/A", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [form, showAdditionalQuestions]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="scroll-bar flex h-[calc(100vh_-_150px)] gap-6 overflow-y-auto py-1">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col space-y-6 px-4">
              <div className="flex">
                <div className="mr-2 w-fit pt-[2px]">
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
              <div className="flex flex-col">
                <FormField
                  control={form.control}
                  name="clientType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex space-x-3">
                        <FormLabel className="w-20">Client Type:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            className="flex space-x-3"
                          >
                            {(ClientTypeSchema.options as ClientTypeType[]).map(
                              (type) => (
                                <FormItem
                                  key={type}
                                  className="flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={type} />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize">
                                    {type.toLowerCase()}
                                  </FormLabel>
                                </FormItem>
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex space-x-3">
                        <FormLabel className="w-20">I am a:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-3"
                          >
                            {[
                              "Faculty",
                              "Non-Teaching Staff",
                              "Student",
                              "Alumna",
                              "Guardian/Parent of Student",
                              "Others",
                            ].map((position) => (
                              <FormItem
                                key={position}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={position} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {position}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("position") === "Others" && (
                  <FormField
                    control={form.control}
                    name="otherPosition"
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Separator className="my-4" />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex space-x-3">
                        <FormLabel className="w-20">Sex:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-3"
                          >
                            {["Male", "Female"].map((sex) => (
                              <FormItem
                                key={sex}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={sex} />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {sex}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your Age"
                            autoComplete="off"
                            {...field}
                            min={0}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                (parseInt(value, 10) >= 0 &&
                                  parseInt(value, 10) <= 99)
                              ) {
                                field.onChange(parseInt(e.target.value, 10));
                              }
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="regionOfResidence"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Region of Residence</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Residence"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col space-y-6 px-4">
              <div className="flex">
                <div className="mr-2 w-fit pt-[2px]">
                  <Info className="size-4 text-primary" />
                </div>
                <P className="text-muted-foreground">
                  Check mark your answer to the Citizen&apos;s Charter (CC)
                  questions. The Citizen&apos;s is an official document that
                  reflects the services of a government agency/office including
                  its requirements, fees, and processing times among others.
                </P>
              </div>
              <div className="space-y-9">
                <FormField
                  control={form.control}
                  name="awarenessLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        CC1 Which of the following best describes your awareness
                        of a CC?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="aware_and_saw" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I know what a CC is and I saw this office&apos;s
                              CC.
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="aware_but_not_saw" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I know what a CC is but I did NOT see this
                              office&apos;s CC.
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="learned_when_saw" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I learned of the CC only when I saw this
                              office&apos;s CC.
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="not_aware" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I do not know what a CC is and I did not see one
                              in this office.
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showAdditionalQuestions && (
                  <>
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            CC2 if aware of CC, would you say that the CC of
                            this office was...?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="easy" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Easy to see
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="somewhat_easy" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Somewhat easy to see
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="difficult" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Difficult to see
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="not_visible" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Not visible at all
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="helpfulness"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>
                            CC3 if aware of CC, how much did the CC help you in
                            your transaction?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="very_helpful" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Helped very much
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="somewhat_helpful" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Somewhat helped
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="not_helpful" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Did not help
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-6 px-4">
              <div className="flex">
                <div className="mr-2 w-fit pt-[2px]">
                  <Info className="size-4 text-primary" />
                </div>
                <P className="text-muted-foreground">
                  For SQD 0-8, please put a check mark on the column that best
                  corresponds to your answer
                </P>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-[1fr,auto] gap-4">
                  <div className="flex items-center justify-center">
                    <FormLabel className="text-lg font-semibold">
                      Service Quality Dimensions
                    </FormLabel>
                  </div>
                  <div className="flex justify-between space-x-4">
                    {emojiRatings.map((emoji, index) => (
                      <div key={index} className="flex-1 text-center">
                        <div className="text-2xl">{emoji}</div>
                        <div className="text-xs">
                          {emojiMeanings[index].label}
                        </div>
                      </div>
                    ))}
                  </div>
                  {surveyQuestions.map((question, questionIndex) => (
                    <React.Fragment key={questionKeys[questionIndex]}>
                      <P className="flex h-16 items-center">{question}</P>
                      <div className="flex justify-between space-x-4">
                        {emojiMeanings.map((meaning, emojiIndex) => (
                          <FormField
                            key={emojiIndex}
                            control={form.control}
                            name={`surveyResponses.${questionKeys[questionIndex]}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-1 items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value === meaning.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(
                                        checked ? meaning.value : ""
                                      );
                                    }}
                                    className="size-10"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <FormField
              control={form.control}
              name="suggestions"
              render={({ field }) => (
                <FormItem className="px-4 pb-1">
                  <FormLabel>
                    Suggestions on how we can further improve our services
                    (optional):
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your suggestions here"
                      className="bg-transparent text-sm shadow-none focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="my-4" />
        <DialogFooter>
          {isFieldsDirty ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
              variant="destructive"
              disabled={isPending}
            >
              Reset form
            </Button>
          ) : (
            <div></div>
          )}
          <SubmitButton disabled={isPending} type="submit" className="w-28">
            Submit
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
