import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { P } from "../typography/text";

const alertCardVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        destructive:
        "border-red-500/20 bg-red-100 text-red-500 dark:bg-red-900/20 [&>svg]:text-red-500",
        success:
          "border-green-500/20 bg-green-100 text-green-500 dark:bg-green-900/20 [&>svg]:text-green-500",
        warning:
          "border-yellow-500/20 bg-yellow-100 text-yellow-500 dark:bg-yellow-900/20 [&>svg]:text-yellow-500",
        info: "border-blue-500/20 bg-blue-100 text-blue-500 dark:bg-blue-900/20 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const icons = {
  default: AlertCircle,
  destructive: X,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface AlertCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertCardVariants> {
  title?: string;
  description?: string;
  icon?: keyof typeof icons;
  onDismiss?: () => void;
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  (
    { className, variant, title, description, icon, onDismiss, ...props },
    ref
  ) => {
    const Icon = icon ? icons[icon] : icons[variant || "default"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertCardVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="flex w-full items-center justify-between">
          <div>
            {title && (
              <P className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </P>
            )}
            {description && (
              <P className="[&_p]:leading-relaxed">{description}</P>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-4 rounded-full p-1 transition-colors hover:bg-secondary"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

AlertCard.displayName = "AlertCard";

export { AlertCard };
