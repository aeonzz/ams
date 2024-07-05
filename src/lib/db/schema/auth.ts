import { z } from "zod";

export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(64),
  password: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(15, { message: "Cannot be more than 15 characters long" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().min(1).optional(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: "Must be at least 4 characters long" })
      .max(15, { message: "Cannot be more than 15 characters long" }),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(15, { message: "Cannot be more than 15 characters long" }),
  resetPasswordToken: z.string().min(1),
});

export type UsernameAndPassword = z.infer<typeof authenticationSchema>;
