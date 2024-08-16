import * as z from "zod"

export const requestSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type GetRequestsSchema = z.infer<typeof requestSearchParamsSchema>

export const userSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type GetUsersSchema = z.infer<typeof userSearchParamsSchema>

// export const createTaskSchema = z.object({
//   title: z.string(),
//   label: z.enum(tasks.label.enumValues),
//   status: z.enum(tasks.status.enumValues),
//   priority: z.enum(tasks.priority.enumValues),
// })

// export type CreateTaskSchema = z.infer<typeof createTaskSchema>

// export const updateTaskSchema = z.object({
//   title: z.string().optional(),
//   label: z.enum(tasks.label.enumValues).optional(),
//   status: z.enum(tasks.status.enumValues).optional(),
//   priority: z.enum(tasks.priority.enumValues).optional(),
// })

// export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
