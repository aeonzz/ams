import * as React from "react";
import { cn } from "@/lib/utils";

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3", className)}
    {...props}
  />
));
Section.displayName = "Section";

const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xl font-semibold", className)}
    {...props}
  />
));
SectionTitle.displayName = "SectionTitle";

const SectionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[75px] border-b pb-6", className)}
    {...props}
  />
));
SectionItem.displayName = "SectionItem";

const SectionItemHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col justify-end space-y-1", className)}
    {...props}
  />
));
SectionItemHeader.displayName = "SectionItemHeader";

const SectionItemTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-md", className)} {...props} />
));
SectionItemTitle.displayName = "SectionItemTitle";

const SectionItemDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SectionItemDescription.displayName = "SectionItemDescription";

const SectionItemAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-auto flex-col justify-end", className)}
    {...props}
  />
));
SectionItemAction.displayName = "SectionItemAction";

export {
  Section,
  SectionTitle,
  SectionItem,
  SectionItemHeader,
  SectionItemTitle,
  SectionItemDescription,
  SectionItemAction,
};
