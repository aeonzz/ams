"use client";

import { useFontSize } from "@/lib/hooks/use-font-size";
import { cn, getFontSizeClass } from "@/lib/utils";
import React, { forwardRef } from "react";

const H1 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-3xl",
    "text-2xl",
    "text-4xl"
  );

  return <h1 ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
H1.displayName = "H1";

const H2 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-2xl",
    "text-xl",
    "text-3xl"
  );

  return <h2 ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
H2.displayName = "H2";

const H3 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-xl",
    "text-lg",
    "text-2xl"
  );

  return <h3 ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
H3.displayName = "H3";

const H4 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-lg",
    "text-base",
    "text-xl"
  );

  return <h4 ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
H4.displayName = "H4";

const H5 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-base",
    "text-sm",
    "text-lg"
  );

  return <h5 ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
H5.displayName = "H5";

const P = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { fontSize } = useFontSize();

  const fontSizeClass = getFontSizeClass(
    fontSize,
    "text-sm",
    "text-xs",
    "text-base"
  );

  return <p ref={ref} className={cn(fontSizeClass, className)} {...props} />;
});
P.displayName = "P";

const Tspan = forwardRef<SVGTSpanElement, React.SVGProps<SVGTSpanElement>>(
  ({ className, ...props }, ref) => {
    const { fontSize } = useFontSize();

    const fontSizeClass = getFontSizeClass(
      fontSize,
      "text-xs",
      "text-xs",
      "text-sm"
    );

    return (
      <tspan ref={ref} className={cn(fontSizeClass, className)} {...props} />
    );
  }
);
Tspan.displayName = "Tspan";

export { H1, H2, H3, H4, H5, P, Tspan };
