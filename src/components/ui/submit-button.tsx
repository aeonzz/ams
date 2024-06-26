'use client';

import LoadingSpinner from '@/components/loaders/loading-spinner';
import {
  Button,
  ButtonIconProps,
  ButtonProps,
  buttonVariants,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';

const SubmitButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
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
    const Comp = asChild ? Slot : 'button';
    return (
      <LazyMotion features={domAnimation}>
        <Comp
          className={cn(
            'relative overflow-hidden',
            buttonVariants({ variant, size, className })
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          {Icon && iconPlacement === 'left' && (
            <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
              <Icon size={16} className="stroke-primary" />
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {disabled ? (
              <m.div
                key="loading"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <LoadingSpinner />
              </m.div>
            ) : (
              <m.div
                key="standby"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: 30 }}
                transition={{ duration: 0.2, type: 'spring' }}
              >
                <Slottable>{props.children}</Slottable>
              </m.div>
            )}
          </AnimatePresence>
          {Icon && iconPlacement === 'right' && (
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
              <Icon size={16} className="stroke-primary" />
            </div>
          )}
        </Comp>
      </LazyMotion>
    );
  }
);
SubmitButton.displayName = 'SubmitButton';

export { SubmitButton };
