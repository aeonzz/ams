"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const surveyQuestions = [
  "SQ01: The staff was responsive and attentive to my needs.",
  "SQ02: The service delivered met the transaction's requirements and expectations.",
  "SQ03: The service was delivered in a timely manner.",
  "SQ04: I easily found the office that I needed to transact with.",
  "SQ05: The fees were reasonable for my transaction.",
  "SQ06: I paid the correct fees/amount for my transaction.",
  "SQ07: I was treated courteously by the staff.",
  "Overall: How satisfied are you with the service provided?",
] as const;

const emojiRatings = ["😞", "🙁", "😐", "🙂", "😃"] as const;

type SurveyQuestion = (typeof surveyQuestions)[number];
type ClientType = "individual" | "business" | "government";
type Sex = "male" | "female" | "other";
type AwarenessLevel =
  | "aware_and_saw"
  | "aware_but_not_saw"
  | "learned_when_saw"
  | "not_aware";
type Visibility = "easy" | "somewhat_easy" | "difficult" | "not_visible";
type Helpfulness = "very_helpful" | "somewhat_helpful" | "not_helpful";

interface FormData {
  clientType: ClientType | "";
  position: string;
  sex: Sex | "";
  age: string;
  regionOfResidence: string;
  awarenessLevel: AwarenessLevel | "";
  visibility: Visibility | "";
  helpfulness: Helpfulness | "";
  surveyResponses: Partial<Record<SurveyQuestion, number>>;
  suggestions: string;
}

export default function JobRequestEvaluationForm() {
  const [formData, setFormData] = useState<FormData>({
    clientType: "",
    position: "",
    sex: "",
    age: "",
    regionOfResidence: "",
    awarenessLevel: "",
    visibility: "",
    helpfulness: "",
    surveyResponses: {},
    suggestions: "",
  });

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSurveyResponse = (question: SurveyQuestion, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      surveyResponses: { ...prev.surveyResponses, [question]: rating },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/job-request-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Evaluation submitted successfully");
        // Reset form or show success message
      } else {
        console.error("Failed to submit evaluation");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Job Request Evaluation</CardTitle>
        <CardDescription>
          Please fill out this form to evaluate your job request experience.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientType">Client Type</Label>
              <Select
                onValueChange={(value: ClientType) =>
                  handleInputChange("clientType", value)
                }
              >
                <SelectTrigger id="clientType">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                onValueChange={(value: Sex) => handleInputChange("sex", value)}
              >
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region of Residence</Label>
              <Input
                id="region"
                onChange={(e) =>
                  handleInputChange("regionOfResidence", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Citizen's Charter Awareness</Label>
            <RadioGroup
              onValueChange={(value: AwarenessLevel) =>
                handleInputChange("awarenessLevel", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aware_and_saw" id="aware_and_saw" />
                <Label htmlFor="aware_and_saw">
                  I know what a CC is and I saw this office's CC.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="aware_but_not_saw"
                  id="aware_but_not_saw"
                />
                <Label htmlFor="aware_but_not_saw">
                  I know what a CC is but I did NOT see this office's CC.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="learned_when_saw"
                  id="learned_when_saw"
                />
                <Label htmlFor="learned_when_saw">
                  I learned of the CC only when I saw this office's CC.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_aware" id="not_aware" />
                <Label htmlFor="not_aware">
                  I do not know what a CC is and I did not see one in this
                  office.
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Citizen's Charter Visibility</Label>
            <RadioGroup
              onValueChange={(value: Visibility) =>
                handleInputChange("visibility", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="visibility_easy" />
                <Label htmlFor="visibility_easy">Easy to see</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="somewhat_easy"
                  id="visibility_somewhat_easy"
                />
                <Label htmlFor="visibility_somewhat_easy">
                  Somewhat easy to see
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="difficult" id="visibility_difficult" />
                <Label htmlFor="visibility_difficult">Difficult to see</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="not_visible"
                  id="visibility_not_visible"
                />
                <Label htmlFor="visibility_not_visible">
                  Not visible at all
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Citizen's Charter Helpfulness</Label>
            <RadioGroup
              onValueChange={(value: Helpfulness) =>
                handleInputChange("helpfulness", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_helpful" id="helpfulness_very" />
                <Label htmlFor="helpfulness_very">Helped very much</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="somewhat_helpful"
                  id="helpfulness_somewhat"
                />
                <Label htmlFor="helpfulness_somewhat">Somewhat helped</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_helpful" id="helpfulness_not" />
                <Label htmlFor="helpfulness_not">Did not help</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-6">
            <Label className="text-lg font-semibold">
              Service Quality Dimensions
            </Label>
            <div className="grid grid-cols-[1fr,auto] gap-4">
              <div></div>
              <div className="flex justify-between space-x-4">
                {emojiRatings.map((emoji, index) => (
                  <div key={index} className="text-2xl">
                    {emoji}
                  </div>
                ))}
              </div>
              {surveyQuestions.map((question, questionIndex) => (
                <React.Fragment key={questionIndex}>
                  <div className="flex items-center">{question}</div>
                  <div className="flex justify-between space-x-4">
                    {emojiRatings.map((_, emojiIndex) => (
                      <Checkbox
                        key={emojiIndex}
                        checked={
                          formData.surveyResponses[question] === emojiIndex + 1
                        }
                        onCheckedChange={() =>
                          handleSurveyResponse(question, emojiIndex + 1)
                        }
                      />
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestions">
              Suggestions on how we can further improve our services (optional):
            </Label>
            <textarea
              id="suggestions"
              className="h-24 w-full rounded-md border p-2"
              placeholder="Enter your suggestions here"
              onChange={(e) => handleInputChange("suggestions", e.target.value)}
            ></textarea>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Evaluation
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
