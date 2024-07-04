import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SettingsMenuButtonProps {
  active: boolean;
  href: string;
  label: string;
}

export default function SettingsMenuButton({active, href, label} : SettingsMenuButtonProps) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className="mb-1 h-10 w-full justify-start"
      asChild
    >
      <Link href={href} prefetch>
        <p className={cn('max-w-[200px] truncate')}>{label}</p>
      </Link>
    </Button>
  )
}
