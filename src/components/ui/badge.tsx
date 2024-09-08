import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { H1, P } from "../typography/text";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:text-secondary-foreground dark:hover:bg-secondary",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-destructive/80 dark:text-destructive-foreground dark:hover:bg-destructive",
        outline: "text-foreground dark:text-foreground",

        blue: "bg-blue-300/30 border-blue-300/30 dark:bg-blue-300/10 dark:border-blue-300/10",
        green:
          "bg-green-300/30 border-green-300/30 dark:bg-green-300/10 dark:border-green-300/10",
        purple:
          "bg-purple-300/30 border-purple-300/30 dark:bg-purple-300/10 dark:border-purple-300/10",
        red: "bg-red-300/30 border-red-300/30 dark:bg-red-300/10 dark:border-red-300/10",
        orange:
          "bg-orange-300/30 border-orange-300/30 dark:bg-orange-300/10 dark:border-orange-300/10",
        yellow:
          "bg-yellow-300/30 border-yellow-300/30 dark:bg-yellow-300/10 dark:border-yellow-300/10",
        gray: "bg-gray-300/30 border-gray-300/30 dark:bg-gray-300/10 dark:border-gray-300/10",

        indigo:
          "bg-indigo-300/30 border-indigo-300/30 dark:bg-indigo-300/10 dark:border-indigo-300/10",
        pink: "bg-pink-300/30 border-pink-300/30 dark:bg-pink-300/10 dark:border-pink-300/10",
        teal: "bg-teal-300/30 border-teal-300/30 dark:bg-teal-300/10 dark:border-teal-300/10",
        cyan: "bg-cyan-300/30 border-cyan-300/30 dark:bg-cyan-300/10 dark:border-cyan-300/10",
        lime: "bg-lime-300/30 border-lime-300/30 dark:bg-lime-300/10 dark:border-lime-300/10",
        amber:
          "bg-amber-300/30 border-amber-300/30 dark:bg-amber-300/10 dark:border-amber-300/10",
        emerald:
          "bg-emerald-300/30 border-emerald-300/30 dark:bg-emerald-300/10 dark:border-emerald-300/10",
        violet:
          "bg-violet-300/30 border-violet-300/30 dark:bg-violet-300/10 dark:border-violet-300/10",
        fuchsia:
          "bg-fuchsia-300/30 border-fuchsia-300/30 dark:bg-fuchsia-300/10 dark:border-fuchsia-300/10",
        rose: "bg-rose-300/30 border-rose-300/30 dark:bg-rose-300/10 dark:border-rose-300/10",
        sky: "bg-sky-300/30 border-sky-300/30 dark:bg-sky-300/10 dark:border-sky-300/10",

        slate:
          "bg-slate-300/30 border-slate-300/30 dark:bg-slate-300/10 dark:border-slate-300/10",
        zinc: "bg-zinc-300/30 border-zinc-300/30 dark:bg-zinc-300/10 dark:border-zinc-300/10",
        stone:
          "bg-stone-300/30 border-stone-300/30 dark:bg-stone-300/10 dark:border-stone-300/10",
        neutral:
          "bg-neutral-300/30 border-neutral-300/30 dark:bg-neutral-300/10 dark:border-neutral-300/10",

        info: "bg-blue-300/30 border-blue-300/30 dark:bg-blue-300/10 dark:border-blue-300/10",
        success:
          "bg-green-300/30 border-green-300/30 dark:bg-green-300/10 dark:border-green-300/10",
        warning:
          "bg-amber-300/30 border-amber-300/30 dark:bg-amber-300/10 dark:border-amber-300/10",
        error:
          "bg-red-300/30 border-red-300/30 dark:bg-red-300/10 dark:border-red-300/10",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
