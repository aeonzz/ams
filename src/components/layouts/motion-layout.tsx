import React from "react";
import { motion, MotionProps } from "framer-motion";

import { outExpo } from "@/lib/easings";

type MotionLayoutProps = React.HTMLAttributes<HTMLDivElement> & MotionProps;

const MotionLayout = React.forwardRef<HTMLDivElement, MotionLayoutProps>(({ className, ...props }, ref) => {
  return (
    <motion.div layout className={className} transition={{ duration: 0.3, ease: outExpo }} ref={ref} {...props}>
      {props.children}
    </motion.div>
  );
});
MotionLayout.displayName = "MotionLayout";

export { MotionLayout };
