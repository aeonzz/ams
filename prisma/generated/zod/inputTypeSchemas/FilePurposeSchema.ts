import { z } from 'zod';

export const FilePurposeSchema = z.enum(['NONE','IMAGE','JOB_FORM','VENUE_FORM','TRANSPORT_FORM','SUPPLY_FORM','FACILITY_FORM']);

export type FilePurposeType = `${z.infer<typeof FilePurposeSchema>}`

export default FilePurposeSchema;
