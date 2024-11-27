"use client";

import { forwardRef } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { AnimatePresence, motion, MotionProps } from "framer-motion";

import { outExpo } from "@/lib/easings";
import { cn, getFontSizeClass } from "@/lib/utils";
import {
  Button,
  ButtonIconProps,
  ButtonProps,
  buttonVariants,
} from "@/components/ui/button";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { useFontSize } from "@/lib/hooks/use-font-size";

type SubmitButtonProps = ButtonProps & ButtonIconProps & MotionProps;

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      className,
      variant,
      size,
      Icon,
      iconPlacement,
      asChild = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const { fontSize } = useFontSize();

    const fontSizeClass = getFontSizeClass(
      fontSize,
      "text-sm",
      "text-xs",
      "text-base"
    );
    return (
      <Comp
        className={cn(
          "relative overflow-hidden",
          fontSizeClass,
          buttonVariants({ variant, size, className })
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {Icon && iconPlacement === "left" && (
          <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
            <Icon size={16} className="stroke-primary" />
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {disabled ? (
            <motion.div
              key="loading"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div
              key="standby"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              transition={{ duration: 0.2, type: "spring" }}
            >
              <Slottable>{props.children}</Slottable>
            </motion.div>
          )}
        </AnimatePresence>
        {Icon && iconPlacement === "right" && (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            <Icon size={16} className="stroke-primary" />
          </div>
        )}
      </Comp>
    );
  }
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
