import * as z from "zod";

export const requestSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  type: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetRequestsSchema = z.infer<typeof requestSearchParamsSchema>;

export const userSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetUsersSchema = z.infer<typeof userSearchParamsSchema>;

export const departmentSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetDepartmentsSchema = z.infer<typeof departmentSearchParamsSchema>;

export const venueSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  venueType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetVenuesSchema = z.infer<typeof venueSearchParamsSchema>;

export const vehicleSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetVehicleSchema = z.infer<typeof vehicleSearchParamsSchema>;

export const inventoryItemSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  departmentName: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetInventoryItemSchema = z.infer<
  typeof inventoryItemSearchParamsSchema
>;

export const inventorySubItemSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  subName: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetInventorySubItemSchema = z.infer<
  typeof inventorySubItemSearchParamsSchema
>;

export const SupplyItemSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  departmentName: z.string().optional(),
  categoryName: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetSupplyItemSchema = z.infer<typeof SupplyItemSearchParamsSchema>;

export const reservationSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetReservationsSchema = z.infer<
  typeof reservationSearchParamsSchema
>;

export const roleManagementSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetRoleManagementSchema = z.infer<
  typeof roleManagementSearchParamsSchema
>;

export const vehicleMaintenanceHistoryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  description: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetVehicleMaintenanceHistory = z.infer<
  typeof vehicleMaintenanceHistoryParamsSchema
>;
