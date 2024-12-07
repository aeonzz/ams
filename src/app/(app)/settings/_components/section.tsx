import * as React from "react";
import { cn } from "@/lib/utils";
import { H4, H5, P } from "@/components/typography/text";

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-6 flex flex-col space-y-3", className)}
    {...props}
  />
));
Section.displayName = "Section";

const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <H4 ref={ref} className={cn("font-semibold", className)} {...props} />
));
SectionTitle.displayName = "SectionTitle";

const SectionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-auto flex-col border-b pb-6 lg:flex-row",
      className
    )}
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
  <H5 ref={ref} className={cn(className)} {...props} />
));
SectionItemTitle.displayName = "SectionItemTitle";

const SectionItemDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <P ref={ref} className={cn("text-muted-foreground", className)} {...props} />
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
