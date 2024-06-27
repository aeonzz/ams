'use client';

import LoadingSpinner from '@/components/loaders/loading-spinner';
import { Button } from '@/components/ui/button';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

export default function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <LazyMotion features={domAnimation}>
      <Button
        className="relative w-full overflow-hidden"
        type="submit"
        disabled={isLoading}
        variant="ringHover"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
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
              key="signIn"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              transition={{ duration: 0.2, type: 'spring' }}
            >
              Sign in
            </m.div>
          )}
        </AnimatePresence>
      </Button>
    </LazyMotion>
  );
}
