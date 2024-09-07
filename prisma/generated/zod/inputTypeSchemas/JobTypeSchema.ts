import { z } from 'zod';

export const JobTypeSchema = z.enum(['ROUTINE_MAINTENANCE','REPAIRS','INSTALLATION','INSPECTION','EMERGENCY_REPAIR','UPGRADES_RENOVATIONS','PREVENTIVE_MAINTENANCE','CALIBRATION_TESTING','CLEANING_JANITORIAL','EVENT_SETUP_SUPPORT','SAFETY_COMPLIANCE_CHECKS','FURNITURE_ASSEMBLY_MOVING','PAINTING_SURFACE_TREATMENT','LANDSCAPING_GROUNDS_MAINTENANCE','IT_SUPPORT_TROUBLESHOOTING','SECURITY_SYSTEMS_MAINTENANCE','WASTE_MANAGEMENT_RECYCLING','TRANSPORT_VEHICLE_MAINTENANCE','SPECIAL_PROJECTS','RESOURCE_SETUP_BREAKDOWN']);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`

export default JobTypeSchema;
