import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { H1, P } from "../typography/text";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        warning: "bg-orange-500 text-white hover:bg-orange-600",
        outline: "text-foreground",
        blue: "bg-blue-500/25 border-blue-500/50 text-blue-500 hover:bg-blue-500/50",
        green:
          "bg-green-500/25 border-green-500/50 text-green-500 hover:bg-green-500/50",
        purple:
          "bg-purple-500/25 border-purple-500/50 text-purple-500 hover:bg-purple-500/50",
        red: "bg-red-500/25 border-red-500/50 text-red-500 hover:bg-red-500/50",
        orange:
          "bg-orange-500/25 border-orange-500/50 text-orange-500 hover:bg-orange-500/50",
        yellow:
          "bg-yellow-500/25 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <P className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
