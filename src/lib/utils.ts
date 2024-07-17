import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
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