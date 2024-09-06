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
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:text-secondary-foreground dark:hover:bg-secondary",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-destructive/80 dark:text-destructive-foreground dark:hover:bg-destructive",
        outline: "text-foreground dark:text-foreground",

        blue: "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 dark:bg-blue-600 dark:border-blue-500 dark:text-blue-100 dark:hover:bg-blue-700",
        green:
          "bg-green-100 border-green-200 text-green-800 hover:bg-green-200 dark:bg-green-600 dark:border-green-500 dark:text-green-100 dark:hover:bg-green-700",
        purple:
          "bg-purple-100 border-purple-200 text-purple-800 hover:bg-purple-200 dark:bg-purple-600 dark:border-purple-500 dark:text-purple-100 dark:hover:bg-purple-700",
        red: "bg-red-100 border-red-200 text-red-800 hover:bg-red-200 dark:bg-red-600 dark:border-red-500 dark:text-red-100 dark:hover:bg-red-700",
        orange:
          "bg-orange-100 border-orange-200 text-orange-800 hover:bg-orange-200 dark:bg-orange-600 dark:border-orange-500 dark:text-orange-100 dark:hover:bg-orange-700",
        yellow:
          "bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-600 dark:border-yellow-500 dark:text-yellow-100 dark:hover:bg-yellow-700",
        gray: "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700",

        indigo:
          "bg-indigo-100 border-indigo-200 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-600 dark:border-indigo-500 dark:text-indigo-100 dark:hover:bg-indigo-700",
        pink: "bg-pink-100 border-pink-200 text-pink-800 hover:bg-pink-200 dark:bg-pink-600 dark:border-pink-500 dark:text-pink-100 dark:hover:bg-pink-700",
        teal: "bg-teal-100 border-teal-200 text-teal-800 hover:bg-teal-200 dark:bg-teal-600 dark:border-teal-500 dark:text-teal-100 dark:hover:bg-teal-700",
        cyan: "bg-cyan-100 border-cyan-200 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-600 dark:border-cyan-500 dark:text-cyan-100 dark:hover:bg-cyan-700",
        lime: "bg-lime-100 border-lime-200 text-lime-800 hover:bg-lime-200 dark:bg-lime-600 dark:border-lime-500 dark:text-lime-100 dark:hover:bg-lime-700",
        amber:
          "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200 dark:bg-amber-600 dark:border-amber-500 dark:text-amber-100 dark:hover:bg-amber-700",
        emerald:
          "bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-600 dark:border-emerald-500 dark:text-emerald-100 dark:hover:bg-emerald-700",
        violet:
          "bg-violet-100 border-violet-200 text-violet-800 hover:bg-violet-200 dark:bg-violet-600 dark:border-violet-500 dark:text-violet-100 dark:hover:bg-violet-700",
        fuchsia:
          "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-200 dark:bg-fuchsia-600 dark:border-fuchsia-500 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800",
        rose: "bg-rose-100 border-rose-200 text-rose-800 hover:bg-rose-200 dark:bg-rose-600 dark:border-rose-500 dark:text-rose-100 dark:hover:bg-rose-700",
        sky: "bg-sky-100 border-sky-200 text-sky-800 hover:bg-sky-200 dark:bg-sky-600 dark:border-sky-500 dark:text-sky-100 dark:hover:bg-sky-700",

        slate:
          "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700",
        zinc: "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-700",
        stone:
          "bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-700",
        neutral:
          "bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-700",

        info: "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 dark:bg-blue-600 dark:border-blue-500 dark:text-blue-100 dark:hover:bg-blue-700",
        success:
          "bg-green-100 border-green-200 text-green-800 hover:bg-green-200 dark:bg-green-600 dark:border-green-500 dark:text-green-100 dark:hover:bg-green-700",
        warning:
          "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200 dark:bg-amber-600 dark:border-amber-500 dark:text-amber-100 dark:hover:bg-amber-700",
        error:
          "bg-red-100 border-red-200 text-red-800 hover:bg-red-200 dark:bg-red-600 dark:border-red-500 dark:text-red-100 dark:hover:bg-red-700",
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
