import { ClientTypeSchema } from "prisma/generated/zod";
import { z } from "zod";

const surveyResponseSchema = z.object({
  SQ0: z.string().min(1, "This question is required"),
  SQ1: z.string().min(1, "This question is required"),
  SQ2: z.string().min(1, "This question is required"),
  SQ3: z.string().min(1, "This question is required"),
  SQ4: z.string().min(1, "This question is required"),
  SQ5: z.string().min(1, "This question is required"),
  SQ6: z.string().min(1, "This question is required"),
  SQ7: z.string().min(1, "This question is required"),
  SQ8: z.string().min(1, "This question is required"),
});

export const createJobEvaluationSchema = z.object({
  clientType: ClientTypeSchema,
  position: z.string().min(1, "Postition is required"),
  otherPosition: z.string().optional(),
  sex: z.string().min(1, "Sex is required"),
  age: z.number().int().min(1, "age is required"),
  regionOfResidence: z.string().min(1, "Region of residence is required"),
  awarenessLevel: z.string().min(1, "This field is required"),
  visibility: z.string(),
  helpfulness: z.string(),
  surveyResponses: surveyResponseSchema,
  suggestions: z.string().optional(),
});

export type CreateJobEvaluationSchema = z.infer<
  typeof createJobEvaluationSchema
>;

export const createJobEvaluationSchemaWithPath =
  createJobEvaluationSchema.extend({
    jobRequestId: z.string(),
    path: z.string(),
  });

export type CreateJobEvaluationSchemaWithPath = z.infer<
  typeof createJobEvaluationSchemaWithPath
>;
