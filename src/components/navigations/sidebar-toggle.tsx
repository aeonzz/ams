'use client';

import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen: () => void;
}

export default function SidebarToggle({
  isOpen,
  setIsOpen,
}: SidebarToggleProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '[') {
        e.preventDefault();
        setIsOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="invisible absolute -right-[16px] bottom-14 z-20 lg:visible">
      <Button
        onClick={() => setIsOpen()}
        className="h-8 w-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform duration-700 ease-out-expo',
            isOpen === false ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>
    </div>
  );
}
