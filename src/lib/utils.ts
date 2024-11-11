import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AlertTriangle,
  CheckCircle,
  Hourglass,
  Calendar,
  XCircle,
  PauseCircle,
  Clock,
  Eye,
  CalendarCheck,
  CircleIcon,
  Minus,
  SignalLow,
  SignalMedium,
  SignalHigh,
  TriangleAlert,
  UserIcon,
  Shield,
  ShieldCheck,
  Briefcase,
  Package,
  MapPin,
  type LucideIcon,
  CarFront,
  Truck,
  PenTool,
  BookMarked,
  CircleX,
  Search,
  RotateCcw,
  RefreshCw,
  User,
  UserCheck,
  MessageSquare,
  FilePlus,
  FileMinus,
  AlertCircle,
  Plus,
  Trash2,
  RotateCw,
  Archive,
  PlayCircle,
  Edit,
  Lock,
  Map,
  Box,
} from "lucide-react";
import { type RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { type PriorityTypeType } from "prisma/generated/zod/inputTypeSchemas/PriorityTypeSchema";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { BadgeVariant } from "@/components/ui/badge";
import { type VehicleStatusType } from "prisma/generated/zod/inputTypeSchemas/VehicleStatusSchema";
import { type VenueStatusType } from "prisma/generated/zod/inputTypeSchemas/VenueStatusSchema";
import { type ItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";
import { User as UserType, type UserWithRelations } from "prisma/generated/zod";
import { JobStatusType } from "prisma/generated/zod/inputTypeSchemas/JobStatusSchema";
import { SupplyItemStatusType } from "prisma/generated/zod/inputTypeSchemas/SupplyItemStatusSchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const getFontSizeClass = (
  fontSize: string,
  defaultSize: string,
  smallSize: string,
  largeSize: string
) => {
  switch (fontSize) {
    case "small":
      return smallSize;
    case "large":
      return largeSize;
    default:
      return defaultSize;
  }
};

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

// type RoleIconConfig = {
//   icon: LucideIcon;
//   variant: BadgeVariant;
// };

// type RoleIconMap = {
//   [key in RoleTypeType]: RoleIconConfig;
// };

// export function getRoleIcon(role: RoleTypeType): RoleIconConfig {
//   const RoleIcons: RoleIconMap = {
//     USER: {
//       icon: UserIcon,
//       variant: "blue",
//     },
//     REQUEST_MANAGER: {
//       icon: Shield,
//       variant: "green",
//     },
//     ADMIN: {
//       icon: ShieldCheck,
//       variant: "red",
//     },
//   };
//   return RoleIcons[role] || { icon: CircleIcon, variant: "default" };
// }

type PermissionGuard = {
  currentUser: UserWithRelations;
  allowedRoles: string[];
};

export function permissionGuard({
  allowedRoles,
  currentUser,
}: PermissionGuard) {
  const hasAllowedRole = currentUser.userRole.some((role) =>
    allowedRoles.includes(role.role.name)
  );

  return hasAllowedRole;
}

export function getPriorityIcon(priority: PriorityTypeType) {
  const priorityIcons = {
    NO_PRIORITY: Minus,
    LOW: SignalLow,
    MEDIUM: SignalMedium,
    HIGH: SignalHigh,
    URGENT: TriangleAlert,
  };

  return priorityIcons[priority] || CircleIcon;
}

type StatusColorConfig = {
  color: string;
  variant: BadgeVariant;
  stroke: number;
};

type StatusColorMap = {
  [key in RequestStatusTypeType]: StatusColorConfig;
};

export function getStatusColor(
  status: RequestStatusTypeType
): StatusColorConfig {
  const statusColors: StatusColorMap = {
    APPROVED: {
      color: "#84cc16",
      variant: "lime",
      stroke: 10,
    },
    PENDING: {
      color: "#eab308",
      variant: "yellow",
      stroke: 10,
    },
    REJECTED: {
      color: "#ef4444",
      variant: "red",
      stroke: 10,
    },
    CANCELLED: {
      color: "#6b7280",
      variant: "gray",
      stroke: 10,
    },
    COMPLETED: {
      color: "#22c55e",
      variant: "green",
      stroke: 10,
    },
    REVIEWED: {
      color: "#a855f7",
      variant: "purple",
      stroke: 10,
    },
  };

  return (
    statusColors[status] || {
      color: "#64748b",
      variant: "gray",
      stroke: 10,
    }
  );
}

type VenueStatusColorConfig = {
  color: string;
  variant: BadgeVariant;
  stroke: number;
};

type VenueStatusColorMap = {
  [key in VenueStatusType]: VenueStatusColorConfig;
};

export function getVenueStatusColor(
  status: VenueStatusType
): VenueStatusColorConfig {
  const venueStatusColors: VenueStatusColorMap = {
    AVAILABLE: {
      color: "#22c55e",
      variant: "green",
      stroke: 10,
    },
    IN_USE: {
      color: "#eab308",
      variant: "yellow",
      stroke: 10,
    },
    UNDER_MAINTENANCE: {
      color: "#ef4444",
      variant: "red",
      stroke: 10,
    },
    RESERVED: {
      color: "#a855f7",
      variant: "purple",
      stroke: 10,
    },
    CLOSED: {
      color: "#6b7280",
      variant: "gray",
      stroke: 10,
    },
  };

  return (
    venueStatusColors[status] || {
      color: "#64748b",
      variant: "gray",
      stroke: 10,
    }
  );
}

type JobStatusColorConfig = {
  color: string;
  variant: BadgeVariant;
  stroke: number;
};

type JobStatusColorMap = {
  [key in JobStatusType]: JobStatusColorConfig;
};

export function getJobStatusColor(status: JobStatusType): JobStatusColorConfig {
  const jobStatusColors: JobStatusColorMap = {
    PENDING: {
      color: "#eab308",
      variant: "yellow",
      stroke: 10,
    },
    IN_PROGRESS: {
      color: "#3a40e8",
      variant: "info",
      stroke: 10,
    },
    COMPLETED: {
      color: "#22c55e",
      variant: "green",
      stroke: 10,
    },
    CANCELLED: {
      color: "#6b7280",
      variant: "gray",
      stroke: 10,
    },
    ON_HOLD: {
      color: "#a855f7",
      variant: "purple",
      stroke: 10,
    },
    REJECTED: {
      color: "#ef4444",
      variant: "red",
      stroke: 10,
    },
    REWORK_IN_PROGRESS: {
      color: "#f59e0b",
      variant: "orange",
      stroke: 10,
    },
    VERIFIED: {
      color: "#3b82f6",
      variant: "blue",
      stroke: 10,
    },
  };

  return jobStatusColors[status];
}

type VehicleStatusColorConfig = {
  color: string;
  variant: BadgeVariant;
  stroke: number;
};

type VehicleStatusColorMap = {
  [key in VehicleStatusType]: VehicleStatusColorConfig;
};

export function getVehicleStatusColor(
  status: VehicleStatusType
): VehicleStatusColorConfig {
  const vehicleStatusColors: VehicleStatusColorMap = {
    AVAILABLE: {
      color: "#22c55e",
      variant: "green",
      stroke: 10,
    },
    IN_USE: {
      color: "#eab308",
      variant: "yellow",
      stroke: 10,
    },
    UNDER_MAINTENANCE: {
      color: "#ef4444",
      variant: "red",
      stroke: 10,
    },
    RESERVED: {
      color: "#a855f7",
      variant: "purple",
      stroke: 10,
    },
  };

  return (
    vehicleStatusColors[status] || {
      color: "#64748b",
      variant: "gray",
      stroke: 10,
    }
  );
}

type SupplyStatusColorConfig = {
  color: string;
  variant: BadgeVariant;
  stroke: number;
};

type SupplyStatusColorMap = {
  [key in SupplyItemStatusType]: SupplyStatusColorConfig;
};

export function getSupplyStatusColor(
  status: SupplyItemStatusType
): SupplyStatusColorConfig {
  const supplyStatusColors: SupplyStatusColorMap = {
    IN_STOCK: {
      color: "#22c55e",
      variant: "green",
      stroke: 10,
    },
    LOW_STOCK: {
      color: "#eab308",
      variant: "yellow",
      stroke: 10,
    },
    OUT_OF_STOCK: {
      color: "#ef4444",
      variant: "red",
      stroke: 10,
    },
    ORDERED: {
      color: "#a855f7",
      variant: "purple",
      stroke: 10,
    },
    EXPIRED: {
      color: "#64748b",
      variant: "gray",
      stroke: 10,
    },
  };

  return (
    supplyStatusColors[status] || {
      color: "#64748b",
      variant: "gray",
      stroke: 10,
    }
  );
}

type RequestTypeIconConfig = {
  icon: LucideIcon;
  variant: BadgeVariant;
};

type RequestTypeIconsMap = {
  [key in RequestTypeType]: RequestTypeIconConfig;
};

export function getRequestTypeIcon(
  requestType: RequestTypeType
): RequestTypeIconConfig {
  const requestTypeIcons: RequestTypeIconsMap = {
    JOB: {
      icon: Briefcase,
      variant: "teal",
    },
    BORROW: {
      icon: Box,
      variant: "purple",
    },
    SUPPLY: {
      icon: Package,
      variant: "blue",
    },
    VENUE: {
      icon: MapPin,
      variant: "yellow",
    },
    TRANSPORT: {
      icon: CarFront,
      variant: "green",
    },
  };

  return (
    requestTypeIcons[requestType] || { icon: CircleIcon, variant: "default" }
  );
}

type ReturnableItemStatusIconConfig = {
  icon: LucideIcon;
  variant: BadgeVariant;
};

type ReturnableItemStatusIconMap = {
  [key in ItemStatusType]: ReturnableItemStatusIconConfig;
};

export function getReturnableItemStatusIcon(
  status: ItemStatusType
): ReturnableItemStatusIconConfig {
  const ReturnableItemStatusIcons: ReturnableItemStatusIconMap = {
    AVAILABLE: {
      icon: CheckCircle,
      variant: "green",
    },
    IN_USE: {
      icon: Truck,
      variant: "blue",
    },
    MAINTENANCE: {
      icon: PenTool,
      variant: "orange",
    },
    LOST: {
      icon: Search,
      variant: "red",
    },
    RETURNED: {
      icon: RotateCcw,
      variant: "gray",
    },
    PENDING_RETURN: {
      icon: Clock,
      variant: "yellow",
    },
  };

  return (
    ReturnableItemStatusIcons[status] || {
      icon: CircleIcon,
      variant: "default",
    }
  );
}

export function isOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

export function formatFullName(
  firstName: string,
  middleName: string | null,
  lastName: string
) {
  const trimmedFirstName = firstName.trim();
  const trimmedMiddleName = middleName?.trim();
  const trimmedLastName = lastName.trim();

  if (trimmedMiddleName) {
    return `${trimmedFirstName} ${trimmedMiddleName} ${trimmedLastName}`;
  } else {
    return `${trimmedFirstName} ${trimmedLastName}`;
  }
}

export const isDateInPast = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const textTransform = (text: string) => {
  const transform = text
    .toLowerCase()
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
  return transform;
};

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(
  value: string,
  { max, min = 0, loop = false }: GetValidNumberConfig
) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

export function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
  min: number;
  max: number;
  step: number;
};

export function getValidArrowNumber(
  value: string,
  { min, max, step }: GetValidArrowNumberConfig
) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

export function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

export function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

export function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

export type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";
export type Period = "AM" | "PM";

export function setDateByType(
  date: Date,
  value: string,
  type: TimePickerType,
  period?: Period
) {
  switch (type) {
    case "minutes":
      return setMinutes(date, value);
    case "seconds":
      return setSeconds(date, value);
    case "hours":
      return setHours(date, value);
    case "12hours": {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "hours":
      return getValidHour(String(date.getHours()));
    case "12hours":
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    default:
      return "00";
  }
}

export function getArrowByType(
  value: string,
  step: number,
  type: TimePickerType
) {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step);
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step);
    case "hours":
      return getValidArrowHour(value, step);
    case "12hours":
      return getValidArrow12Hour(value, step);
    default:
      return "00";
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
export function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

// export function calculatePriority(request) {
//   let score = 0;
//   const weights = {
//     type: { JOB: 3, VENUE: 2, RESOURCE: 1 },
//     department: { ICT: 3, MAINTENANCE: 2, OTHERS: 1 },
//     timeSensitivity: 0.5,
//   };

//   score += weights.type[request.type] || 0;
//   score += weights.department[request.department] || 0;
//   score += Math.max(0, 5 - request.daysUntilNeeded) * weights.timeSensitivity;

//   if (score > 8) return 'URGENT';
//   if (score > 6) return 'HIGH';
//   if (score > 4) return 'MEDIUM';
//   return 'LOW';
// }
